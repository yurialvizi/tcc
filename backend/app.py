from flask import Flask, jsonify, request
from utils.model_loader import load_models
from utils.predictor import predict_with_models, preprocessing
import pandas as pd
import os

app = Flask(__name__)


model_paths = {
    "RandomForest": "saved_models/random_forest.pkl",
    "XGBoost": "saved_models/xgboost.pkl",
    "LogisticRegression": "saved_models/logistic_regression.pkl",
    "MLP": "saved_models/mlp.pkl",
}

models = load_models(model_paths)

@app.route('/')
def home():
    return "TCC Grupo 6 - Credit Risk Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received Data: ", data)

        preprocessed_data = preprocessing(data)
                
        predictions = predict_with_models(models, preprocessed_data)
        
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
if __name__ == '__main__':
    app.run(debug=True)