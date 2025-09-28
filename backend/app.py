from datetime import datetime
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.lazy_model_loader import LazyModelLoader
from utils.predictor import predict_with_models
from utils.helper import preprocessing
from utils.shap import generate_waterfall_plot
from utils.model_downloader import download_models_from_gdrive, check_models_available
import pandas as pd
import numpy as np
import matplotlib
import logging

matplotlib.use('Agg')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Check and download models and data if needed
logger.info("🔍 Checking for saved models and data...")
files_available, missing_files = check_models_available()

if not files_available:
    logger.info(f"📥 Missing files: {missing_files}")
    logger.info("🚀 Downloading models and data folder from Google Drive...")
    download_success = download_models_from_gdrive()
    
    if not download_success:
        logger.error("❌ Failed to download files from Google Drive")
        logger.error("Please check your Google Drive folder ID in utils/model_downloader.py")
    else:
        logger.info("✅ Files download completed!")
else:
    logger.info("✅ All models and data are available locally!")

model_paths = {
    "logistic-regression": "saved_models/logistic_regression.pkl",
    "random-forest": "saved_models/random_forest.pkl",
    "xg-boost": "saved_models/xgboost.pkl",
    "mlp": "saved_models/mlp.pkl",
}

logger.info("🔄 Initializing lazy model loader...")
model_loader = LazyModelLoader(model_paths)
logger.info("✅ Lazy model loader initialized! Models will be loaded on-demand.")

@app.route('/')
def home():
    return "TCC Grupo 6 - Credit Risk Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        preprocessed_data = preprocessing(data)
                
        predictions = predict_with_models(model_loader, preprocessed_data)
        
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/metrics', methods=['GET'])
def metrics():
    try:
        return jsonify(model_loader.get_metrics())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/metrics/<model_name>', methods=['GET'])
def metrics_of_model(model_name):
    try:
        metrics = model_loader.get_metrics(model_name)
        if metrics is None:
            return jsonify({"error": "Model not found"}), 404
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
@app.route('/shap/plots/<model_name>', methods=['GET'])
def shap_plots(model_name):
    try:
        shap_data = model_loader.get_shap(model_name)
        if shap_data is None:
            return jsonify({"error": "Model not found"}), 404
        
        summary_plot_b64 = shap_data.get('summary_plot')
        shap_importance_b64 = shap_data.get('shap_importance')

        return jsonify({
            "summary_plot": summary_plot_b64,
            "shap_importance": shap_importance_b64
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/shap/waterfall/<model_name>', methods=['POST'])
def shap_waterfall(model_name):
    try:
        shap_data = model_loader.get_shap(model_name)
        if shap_data is None:
            return jsonify({"error": "Model not found"}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        validated_sample_df = preprocessing(data)
        validated_sample = validated_sample_df.values[0]  # Convert DataFrame to numpy array
        
        # Get the model (will load it if needed)
        trained_model = model_loader.get_model(model_name)
        scaler = model_loader.get_scaler(model_name)
        
        waterfall_plot_b64 = generate_waterfall_plot(
            trained_model, 
            validated_sample, 
            model_name, 
            None,  # masker will be created in the SHAP function if needed
            scaler
        )
        
        # Unload the model to free memory
        model_loader.unload_model(model_name)
        
        return jsonify({"waterfall_plot": waterfall_plot_b64})
    except Exception as e:
        print(f"Error generating SHAP waterfall plot: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/shap/waterfall', methods=['POST'])
def shap_waterfall_all():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        validated_sample_df = preprocessing(data)
        validated_sample = validated_sample_df.values[0]  # Convert DataFrame to numpy array
        
        waterfall_plots = {}
        
        for model_name in model_loader.model_paths.keys():
            try:
                # Get the model (will load it if needed)
                trained_model = model_loader.get_model(model_name)
                scaler = model_loader.get_scaler(model_name)
                shap_data = model_loader.get_shap(model_name)
                
                waterfall_plot_b64 = generate_waterfall_plot(
                    trained_model, 
                    validated_sample, 
                    model_name, 
                    shap_data.get('masker'), 
                    scaler
                )
                waterfall_plots[model_name] = waterfall_plot_b64
                
                # Unload the model to free memory
                model_loader.unload_model(model_name)
                
            except Exception as e:
                print(f"Error generating SHAP waterfall plot for {model_name}: {e}")
                waterfall_plots[model_name] = None
        
        return jsonify({"waterfall_plots": waterfall_plots})
    except Exception as e:
        print(f"Error generating SHAP waterfall plots: {e}")
        return jsonify({"error": str(e)}), 400


def get_value_counts(df, columns, top_n=None):
    result = {}
    for col in columns:
        counts = df[col].value_counts()
        if top_n:
            counts = counts.head(top_n)
        result[col] = {str(k): int(v) for k, v in counts.items()}
    return result


def bin_numeric_column(series, bins=10):
    return pd.cut(series, bins=bins).astype(str)


@app.route('/analyze', methods=['GET'])
def analyze():
    try:
        # Try to read from local data directory first, then from models directory
        path = 'data/syntetic_sample.csv'
        df = None
        try:
            df = pd.read_csv(path)
            logger.info(f"📊 Loaded data from {path}")
        except FileNotFoundError:
            return jsonify({"error": "Data file not found. Please ensure syntetic_sample.csv is available in the data folder."}), 404
        
        if df is None:
            return jsonify({"error": "Data file not found. Please ensure syntetic_sample.csv is available in the data folder."}), 404

        top_n = request.args.get("top_n", default=None, type=int)
        include_bins = request.args.get("include_bins", default=False, type=lambda x: x.lower() == 'true')

        non_numerical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

        categorical_distributions = get_value_counts(df, non_numerical_cols, top_n=top_n)

        if include_bins:
            df_binned = df.copy()
            for col in numeric_cols:
                df_binned[col] = bin_numeric_column(df[col])
            numeric_distributions = get_value_counts(df_binned, numeric_cols, top_n=top_n)
        else:
            numeric_distributions = get_value_counts(df, numeric_cols, top_n=top_n)

        result = {
            "meta": {
                "total_rows": len(df),
                "columns_count": len(df.columns),
                "generated_at": datetime.utcnow().isoformat()
            },
            "categorical_distributions": categorical_distributions,
            "numerical": numeric_distributions,
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/memory', methods=['GET'])
def memory_status():
    """Get memory usage and loaded models status"""
    try:
        import psutil
        import os
        
        # Get process memory usage
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()
        memory_mb = memory_info.rss / 1024 / 1024
        
        # Get loaded models
        loaded_models = model_loader.get_loaded_models()
        
        return jsonify({
            "memory_usage_mb": round(memory_mb, 2),
            "loaded_models": loaded_models,
            "total_models": len(model_loader.model_paths),
            "available_models": list(model_loader.model_paths.keys())
        })
    except ImportError:
        return jsonify({"error": "psutil not available for memory monitoring"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/memory/unload', methods=['POST'])
def unload_all_models():
    """Unload all models to free memory"""
    try:
        model_loader.unload_all_models()
        return jsonify({"message": "All models unloaded successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    port = os.environ.get("PORT", 5000)
    app.run(host='0.0.0.0', port=port, debug=False)
