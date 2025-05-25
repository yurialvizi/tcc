import joblib

def load_models(model_paths):
    models = {}
    for name, path in model_paths.items():
        models[name] = joblib.load(path)
    return models