def predict_with_models(models, input_data, scalers=None):
    results = {}
    for name, model in models.items():
        # For logistic regression, we need to scale the data
        if name == 'logistic-regression':
            scaler = scalers.get(name) if scalers else None
            if scaler is None:
                raise ValueError("Scaler is required for logistic regression model")
            scaled_data = scaler.transform(input_data)
            pred = model.predict(scaled_data)[0]
        # For other models (random-forest, xg-boost), no scaling needed, or  is handled internally
        else:
            pred = model.predict(input_data)[0]
        
        # TODO: Check if this is right
        results[name] = "Bom Pagador" if pred == 1 else "Mau Pagador"
    return results