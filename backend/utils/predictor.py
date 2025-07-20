def predict_with_models(models, input_data):
    results = {}
    for name, model in models.items():
        pred = model.predict(input_data)[0]
        # TODO: Check if this is right
        results[name] = "Bom Pagador" if pred == 1 else "Mau Pagador"
    return results