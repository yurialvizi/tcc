import joblib
from typing import Dict

def load_models(model_paths) -> tuple[Dict, Dict]:
    models = {}
    metrics = {}
    for name, path in model_paths.items():
        data = joblib.load(path)
        models[name] = data['model']
        metrics[name] = data['metrics']
    return models, metrics