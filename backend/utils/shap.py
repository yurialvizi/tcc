import shap
import base64
import io
import matplotlib.pyplot as plt
import numpy as np

def generate_waterfall_plot(trained_model, sample, model_name, masker=None):
    """
    Generates a SHAP waterfall plot for the given model and sample.
    Args:
        trained_model: The trained model for which the SHAP values are to be computed.
        validated_sample: A sample of data that has been validated and preprocessed.
    """
    if model_name == 'logistic-regression':
        explainer = shap.Explainer(trained_model, masker)
    elif model_name == 'mlp':
        print("Using MLP model for SHAP explainer")
        scaler = trained_model.named_steps['scaler']
        masker = scaler.transform(masker)
        model = trained_model.named_steps['mlp']
        explainer = shap.Explainer(model.predict_proba, masker)
    else:
        explainer = shap.Explainer(trained_model)

    shap_values = explainer(np.array(sample))

    sample_shap_value = shap_values[0]
    if model_name in ['random-forest', 'mlp']:
        sample_shap_value = shap_values[0,:,1]

    shap.plots.waterfall(sample_shap_value, max_display=10, show=False)

    fig = plt.gcf()
    img_bytes = io.BytesIO()
    fig.savefig(img_bytes, format='png', bbox_inches='tight')
    img_bytes.seek(0)
    img_b64 = base64.b64encode(img_bytes.read()).decode('utf-8')
    plt.close(fig)

    return img_b64
