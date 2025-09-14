import shap
import base64
import io
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def generate_waterfall_plot(trained_model, sample, model_name, masker=None, scaler=None):
    """
    Generates a SHAP waterfall plot for the given model and sample.
    Args:
        trained_model: The trained model for which the SHAP values are to be computed.
        validated_sample: A sample of data that has been validated and preprocessed.
    """
    if model_name == 'logistic-regression':
        # For logistic regression, we need to scale the sample data
        # since the model was trained on scaled data but doesn't have a pipeline
        if scaler is None:
            raise ValueError("Scaler is required for logistic regression model")
        sample_flat = np.array(sample).flatten()
        sample_df = pd.DataFrame([sample_flat], columns=scaler.feature_names_in_)
        sample_scaled = scaler.transform(sample_df)
        explainer = shap.Explainer(trained_model, masker)
        shap_values = explainer(sample_scaled)
    elif model_name == 'mlp':
        scaler = trained_model.named_steps['scaler']

        masker_df = pd.DataFrame(masker, columns=scaler.feature_names_in_)
        model = trained_model.named_steps['mlp']
        explainer = shap.Explainer(model.predict_proba, masker_df.values)

        # Scale the sample data to match the masker (which is already scaled)
        sample_flat = np.array(sample).flatten()
        sample_df = pd.DataFrame([sample_flat], columns=scaler.feature_names_in_)
        sample_scaled = scaler.transform(sample_df)
        # Use the MLPClassifier directly with scaled data
        shap_values = explainer(sample_scaled)
    else:
        explainer = shap.Explainer(trained_model)
        shap_values = explainer(np.array(sample))

    sample_shap_value = shap_values[0]
    if model_name in ['random-forest', 'mlp']:
        sample_shap_value = shap_values[0,:,1]

    # Create waterfall plot with feature names for MLP and Logistic Regression models
    if model_name == 'mlp':
        scaler = trained_model.named_steps['scaler']
        # Create a SHAP values object with feature names
        sample_shap_value_with_names = shap.Explanation(
            values=sample_shap_value,
            feature_names=scaler.feature_names_in_,
            data=sample_scaled
        )
        shap.plots.waterfall(sample_shap_value_with_names, max_display=10, show=False)
    elif model_name == 'logistic-regression':
        # Create a SHAP values object with feature names
        sample_shap_value_with_names = shap.Explanation(
            values=sample_shap_value,
            feature_names=scaler.feature_names_in_,
            data=sample_scaled
        )
        shap.plots.waterfall(sample_shap_value_with_names, max_display=10, show=False)
    else:
        shap.plots.waterfall(sample_shap_value, max_display=10, show=False)

    fig = plt.gcf()
    img_bytes = io.BytesIO()
    fig.savefig(img_bytes, format='png', bbox_inches='tight')
    img_bytes.seek(0)
    img_b64 = base64.b64encode(img_bytes.read()).decode('utf-8')
    plt.close(fig)

    return img_b64
