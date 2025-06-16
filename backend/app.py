from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.model_loader import load_models
from utils.predictor import predict_with_models, preprocessing
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

model_paths = {
    "random-forest": "saved_models/random_forest.pkl",
    "xg-boost": "saved_models/xgboost.pkl",
    "logistic-regression": "saved_models/logistic_regression.pkl",
    "mlp": "saved_models/mlp.pkl",
}

trained_models, model_metrics = load_models(model_paths)

@app.route('/')
def home():
    return "TCC Grupo 6 - Credit Risk Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received Data: ", data)

        preprocessed_data = preprocessing(data)
                
        predictions = predict_with_models(trained_models, preprocessed_data)
        
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
def model_metrics_route(model_name):
    try:
        if model_name not in model_metrics:
            return jsonify({"error": "Model not found"}), 404
        return jsonify(model_metrics[model_name])
    except Exception as e:
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
    app.run(host='0.0.0.0', port=5000, debug=True)
