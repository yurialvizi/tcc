from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.model_loader import load_models
from utils.predictor import predict_with_models
from utils.helper import preprocessing
from utils.shap import generate_waterfall_plot
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')

app = Flask(__name__)
CORS(app)

model_paths = {
    "random-forest": "saved_models/random_forest.pkl",
    "xg-boost": "saved_models/xgboost.pkl",
    "logistic-regression": "saved_models/logistic_regression.pkl",
    "mlp": "saved_models/mlp.pkl",
}

trained_models, model_metrics, shap, scalers = load_models(model_paths)

@app.route('/')
def home():
    return "TCC Grupo 6 - Credit Risk Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        preprocessed_data = preprocessing(data)
                
        predictions = predict_with_models(trained_models, preprocessed_data, scalers)
        
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/metrics', methods=['GET'])
def metrics():
    try:
        return jsonify(model_metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/metrics/<model_name>', methods=['GET'])
def metrics_of_model(model_name):
    try:
        if model_name not in model_metrics:
            return jsonify({"error": "Model not found"}), 404
        return jsonify(model_metrics[model_name])
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
@app.route('/shap/plots/<model_name>', methods=['GET'])
def shap_plots(model_name):
    try:
        if model_name not in shap:
            return jsonify({"error": "Model not found"}), 404
        
        summary_plot_b64 = shap[model_name].get('summary_plot')
        shap_importance_b64 = shap[model_name].get('shap_importance')

        return jsonify({
            "summary_plot": summary_plot_b64,
            "shap_importance": shap_importance_b64
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/shap/waterfall/<model_name>', methods=['POST'])
def shap_waterfall(model_name):
    try:
        if model_name not in shap:
            return jsonify({"error": "Model not found"}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        validated_sample_df = preprocessing(data)
        validated_sample = validated_sample_df.values[0]  # Convert DataFrame to numpy array
        
        waterfall_plot_b64 = generate_waterfall_plot(trained_models[model_name], validated_sample, model_name, shap[model_name].get('masker'), scalers.get(model_name))
        
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
        
        for model_name in trained_models.keys():
            try:
                waterfall_plot_b64 = generate_waterfall_plot(
                    trained_models[model_name], 
                    validated_sample, 
                    model_name, 
                    shap[model_name].get('masker'), 
                    scalers.get(model_name)
                )
                waterfall_plots[model_name] = waterfall_plot_b64
            except Exception as e:
                print(f"Error generating SHAP waterfall for {model_name}: {e}")
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
        df = pd.read_csv('data/syntetic_sample.csv')

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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
