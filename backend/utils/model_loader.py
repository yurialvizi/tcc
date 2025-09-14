import joblib
import os
from typing import Dict

def load_models(model_paths) -> tuple[Dict, Dict]:
    base_dir = os.path.dirname(__file__)
    models = {}
    metrics = {}
    shap = {}
    scalers = {}  # Add scalers dictionary
    for name, path in model_paths.items():
        full_path = os.path.join(base_dir, '..', path)
        data = joblib.load(full_path)
        models[name] = data['model']
        metrics[name] = data['metrics']
        shap[name] = data['shap']
        # Load scaler if it exists (for logistic regression)
        if 'scaler' in data:
            scalers[name] = data['scaler']
    return models, metrics, shap, scalers