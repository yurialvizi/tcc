def predict_with_models(model_loader, input_data, scalers=None):
    """
    Predict using pre-loaded models (eager loading)
    """
    results = {}
    for name in model_loader.model_paths.keys():
        try:
            # Get the model (already loaded)
            model = model_loader.get_model(name)
            
            # For logistic regression, we need to scale the data
            if name == 'logistic-regression':
                scaler = model_loader.get_scaler(name)
                if scaler is None:
                    raise ValueError("Scaler is required for logistic regression model")
                scaled_data = scaler.transform(input_data)
                pred = model.predict(scaled_data)[0]
            # For other models (random-forest, xg-boost), no scaling needed
            else:
                pred = model.predict(input_data)[0]
            
            results[name] = "Bom Pagador" if pred == 1 else "Mau Pagador"
            
        except Exception as e:
            print(f"Error predicting with {name}: {e}")
            results[name] = "Error"
    
    return results