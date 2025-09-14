import numpy as np
import shap
import base64
import io
import matplotlib.pyplot as plt
import joblib

def make_serializable(obj):
    if isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, (np.integer, np.floating)):
        return obj.item()
    else:
        return obj

def generate_summary_plot(shap_values, samples):
    shap.summary_plot(shap_values, samples, show=False)
    buf = io.BytesIO()
    fig = plt.gcf()  
    fig.savefig(buf, format="png", bbox_inches='tight')
    plt.close(fig) 
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def generate_bar_plot(shap_values, max_display=15):
    shap.plots.bar(shap_values, max_display=max_display, show=False)
    buf = io.BytesIO()
    fig = plt.gcf()
    fig.savefig(buf, format="png", bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def get_shap_dict(summary_plot_b64, shap_importance_b64, masker=None):
    return {
        "summary_plot": summary_plot_b64,
        "shap_importance": shap_importance_b64,
        "masker": masker if masker is not None else None
    }

def get_metrics_dict(confusion_matrix, classification_report):
    return {
        "confusion_matrix": confusion_matrix,
        "classification_report": classification_report,
    }

def save_to_pickle(model, metrics, shap, path, scaler=None):
    joblib.dump({
        "model": model,
        "metrics": make_serializable(metrics),
        "shap": make_serializable(shap),
        "scaler": scaler
    }, path)
