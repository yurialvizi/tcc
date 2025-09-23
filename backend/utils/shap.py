import shap
import base64
import io
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import random
from .helper import TRAINED_FEATURES

def set_deterministic_seeds():
    """Set random seeds for deterministic behavior"""
    np.random.seed(42)
    random.seed(42)
    # Note: torch.manual_seed(42) would be needed if using PyTorch models


def generate_logistic_regression_waterfall(trained_model, sample, scaler, masker):
    """Generate waterfall plot for Logistic Regression model"""
    set_deterministic_seeds()
    
    # Convert numpy array to DataFrame for scaling
    sample_flat = np.array(sample).flatten()
    sample_df = pd.DataFrame([sample_flat], columns=scaler.feature_names_in_)
    sample_scaled = scaler.transform(sample_df)
    
    # Create explainer and get SHAP values
    explainer = shap.Explainer(trained_model, masker)
    shap_values = explainer(sample_scaled)
    sample_shap_value = shap_values[0]
    
    # Create waterfall plot with feature names
    sample_shap_value_with_names = shap.Explanation(
        values=sample_shap_value,
        feature_names=scaler.feature_names_in_,
        data=sample_scaled
    )
    shap.plots.waterfall(sample_shap_value_with_names, max_display=10, show=False)
    
    return shap_values, sample_shap_value

def generate_mlp_waterfall(trained_model, sample, masker):
    """Generate waterfall plot for MLP model"""
    set_deterministic_seeds()
    
    # Convert sample to 2D array
    sample_2d = np.array(sample).reshape(1, -1)
    
    # Create masker and explainer
    masker_array = np.array(masker)
    masker_df = shap.maskers.Independent(masker_array)
    model = trained_model.named_steps['mlp']
    explainer = shap.Explainer(model.predict_proba, masker_df)
    
    # Get SHAP values
    set_deterministic_seeds()
    shap_values = explainer(sample_2d)
    sample_shap_value = shap_values[0,:,1]  # Class 1 SHAP values
    
    # Create waterfall plot with feature names
    scaler = trained_model.named_steps['scaler']
    sample_shap_value_with_names = shap.Explanation(
        values=sample_shap_value,
        feature_names=scaler.feature_names_in_,
        data=sample_2d
    )
    shap.plots.waterfall(sample_shap_value_with_names, max_display=10, show=False)
    
    return shap_values, sample_shap_value

def generate_random_forest_waterfall(trained_model, sample):
    """Generate waterfall plot for Random Forest model"""
    set_deterministic_seeds()
    
    # Convert sample to 2D array
    sample_2d = np.array(sample).reshape(1, -1)
    
    # Create explainer and get SHAP values
    explainer = shap.Explainer(trained_model)
    shap_values = explainer(sample_2d)
    sample_shap_value = shap_values[:,1]  # Class 1 SHAP values
    
    # Create waterfall plot with feature names
    sample_shap_value_with_names = shap.Explanation(
        values=shap_values.values[0,:,1],  # Use the values for class 1
        base_values=shap_values.base_values[0, 1],  # Use the base value for class 1
        feature_names=TRAINED_FEATURES,
        data=np.array(sample).flatten()
    )
    shap.plots.waterfall(sample_shap_value_with_names, max_display=10, show=False)
    
    return shap_values, sample_shap_value

def generate_xgboost_waterfall(trained_model, sample):
    """Generate waterfall plot for XGBoost model"""
    set_deterministic_seeds()
    
    # Convert sample to 2D array
    sample_2d = np.array(sample).reshape(1, -1)
    
    # Create explainer and get SHAP values
    explainer = shap.Explainer(trained_model)
    shap_values = explainer(sample_2d)
    sample_shap_value = shap_values[0]
    
    # Create waterfall plot with feature names
    sample_shap_value_with_names = shap.Explanation(
        values=shap_values.values[0],  # XGBoost has shape (1, n_features)
        base_values=shap_values.base_values[0],  # XGBoost has shape (1,)
        feature_names=TRAINED_FEATURES,
        data=np.array(sample).flatten()
    )
    shap.plots.waterfall(sample_shap_value_with_names, max_display=10, show=False)
    
    return shap_values, sample_shap_value

def generate_waterfall_plot(trained_model, sample, model_name, masker=None, scaler=None):
    """
    Generates a SHAP waterfall plot for the given model and sample.
    Args:
        trained_model: The trained model for which the SHAP values are to be computed.
        sample: A sample of data that has been validated and preprocessed.
        model_name: Name of the model ('logistic-regression', 'mlp', 'random-forest', 'xg-boost')
        masker: Optional masker for SHAP explainer
        scaler: Optional scaler for models that need scaling
    """
    print(f"Generating waterfall plot for {model_name}")
    print(f"Sample shape: {sample.shape if hasattr(sample, 'shape') else len(sample)}")
    print(f"Sample values: {sample[:5]}...")
    
    # Call the appropriate model-specific function
    if model_name == 'logistic-regression':
        shap_values, sample_shap_value = generate_logistic_regression_waterfall(trained_model, sample, scaler, masker)
    elif model_name == 'mlp':
        shap_values, sample_shap_value = generate_mlp_waterfall(trained_model, sample, masker)
    elif model_name == 'random-forest':
        shap_values, sample_shap_value = generate_random_forest_waterfall(trained_model, sample)
    elif model_name == 'xg-boost':
        shap_values, sample_shap_value = generate_xgboost_waterfall(trained_model, sample)
    else:
        raise ValueError(f"Unknown model name: {model_name}")
    
    print(f"SHAP values shape: {shap_values.shape}")
    print(f"Sample SHAP value shape: {sample_shap_value.shape}")
    
    # Safely print first 5 values
    try:
        if hasattr(sample_shap_value, 'values'):
            print(f"Sample SHAP value (first 5): {sample_shap_value.values[:5]}")
        else:
            print(f"Sample SHAP value (first 5): {sample_shap_value[:5]}")
    except Exception as e:
        print(f"Could not print sample SHAP values: {e}")

    # Convert plot to base64
    fig = plt.gcf()
    img_bytes = io.BytesIO()
    fig.savefig(img_bytes, format='png', bbox_inches='tight')
    img_bytes.seek(0)
    img_b64 = base64.b64encode(img_bytes.read()).decode('utf-8')
    plt.close(fig)

    
    print(f"Waterfall plot generated successfully!")
    print(f"Result length: {len(img_b64)}")
    print(f"Result hash: {hash(img_b64)}")

    return img_b64