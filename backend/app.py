from flask import Flask, jsonify, request
from utils.model_loader import load_models
from utils.predictor import predict_with_models, preprocessing
import pandas as pd
import os

app = Flask(__name__)


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
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)