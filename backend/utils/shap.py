import shap
import base64
import io
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import random
import threading
import logging
import warnings
from .helper import TRAINED_FEATURES

# Suppress sklearn warnings about feature names
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Thread lock for matplotlib operations
matplotlib_lock = threading.Lock()

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
    
    # Create a wrapper function that handles scaling internally
    def model_predict_proba_wrapper(data):
        """Wrapper function that scales data before prediction"""
        if isinstance(data, pd.DataFrame):
            scaled_data = scaler.transform(data)
        else:
            # Convert to DataFrame if needed
            data_df = pd.DataFrame(data, columns=scaler.feature_names_in_)
            scaled_data = scaler.transform(data_df)
        return trained_model.predict_proba(scaled_data)
    
    # Create explainer using the wrapper function with original data masker
    explainer = shap.Explainer(model_predict_proba_wrapper, masker)
    shap_values = explainer(sample_df)  # Use original unscaled data
    sample_shap_value = shap_values[0, :, 1]  # Get SHAP values for class 1 (positive class)
    
    # Create waterfall plot with feature names
    sample_shap_value_with_names = shap.Explanation(
        values=sample_shap_value,
        feature_names=scaler.feature_names_in_,
        data=sample_flat  # Use original unscaled data for display
    )
    shap.plots.waterfall(sample_shap_value_with_names, max_display=10, show=False)
    
    return shap_values, sample_shap_value

def generate_mlp_waterfall(trained_model, sample, masker):
    """Generate waterfall plot for MLP model"""
    set_deterministic_seeds()
    
    # Convert sample to 2D array
    sample_2d = np.array(sample).reshape(1, -1)
    
    # Create a wrapper function that handles the full pipeline
    def mlp_pipeline_predict_proba(data):
        """Wrapper function that uses the full pipeline"""
        return trained_model.predict_proba(data)
    
    # Create masker and explainer using the wrapper function
    masker_array = np.array(masker)
    masker_df = shap.maskers.Independent(masker_array)
    explainer = shap.Explainer(mlp_pipeline_predict_proba, masker_df)
    
    # Get SHAP values using original unscaled data
    set_deterministic_seeds()
    shap_values = explainer(sample_2d)
    
    # Get the actual prediction to ensure consistency
    proba = trained_model.predict_proba(sample_2d)
    prob_class_1 = proba[0, 1]
    
    # Extract SHAP values for class 1
    if len(shap_values.shape) == 3:
        sample_shap_value = shap_values.values[0, :, 1] if hasattr(shap_values, 'values') else shap_values[0, :, 1]
        base_value = shap_values.base_values[0, 1]
    else:
        sample_shap_value = shap_values.values[0] if hasattr(shap_values, 'values') else shap_values[0]
        base_value = shap_values.base_values[0]
    
    # Create waterfall plot with feature names
    scaler = trained_model.named_steps['scaler']
    sample_shap_value_with_names = shap.Explanation(
        values=sample_shap_value,
        base_values=base_value,
        feature_names=scaler.feature_names_in_,
        data=sample_2d[0]  # Use flattened data
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
    
    # Use TreeExplainer for XGBoost (most reliable for tree models)
    explainer = shap.TreeExplainer(trained_model)
    shap_values = explainer(sample_2d)
    
    # Get the probability prediction to match SHAP values
    proba = trained_model.predict_proba(sample_2d)
    prob_class_1 = proba[0, 1]
    
    # For TreeExplainer, shap_values is typically for the positive class
    # We need to convert logit-based SHAP values to probability-based
    if len(shap_values.shape) == 2:
        # Binary classification - shap_values is for positive class
        sample_shap_value = shap_values.values[0] if hasattr(shap_values, 'values') else shap_values[0]
        base_value_logit = explainer.expected_value
    else:
        # Multi-class case
        sample_shap_value = shap_values.values[0, :, 1] if hasattr(shap_values, 'values') else shap_values[0, :, 1]
        base_value_logit = explainer.expected_value[1]
    
    # Convert logit-based base value to probability
    import math
    base_value_prob = 1 / (1 + math.exp(-base_value_logit))
    
    # Scale SHAP values to match probability space
    # The sum of SHAP values should equal the difference between prediction and base
    current_sum = float(np.sum(sample_shap_value))
    target_sum = prob_class_1 - base_value_prob
    
    if abs(current_sum) > 1e-10:  # Avoid division by zero
        scale_factor = target_sum / current_sum
        sample_shap_value = sample_shap_value * scale_factor
    
    # Create waterfall plot with feature names
    sample_shap_value_with_names = shap.Explanation(
        values=sample_shap_value,
        base_values=base_value_prob,
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
    logger.info(f"Generating waterfall plot for {model_name}")
    
    try:
        # Use thread lock for matplotlib operations to prevent segfaults
        with matplotlib_lock:
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

            # Convert plot to base64
            fig = plt.gcf()
            
            # Customize colors: invert the default SHAP colors
            # Default: red = positive, blue = negative
            # We want: blue = positive (good credit), red = negative (bad credit)
            
            # Set this to False to disable color customization if it causes issues
            ENABLE_COLOR_CUSTOMIZATION = True
            
            BLUE_NORMALIZED = [0., 0.54337757, 0.98337906]
            RED_NORMALIZED = [1., 0., 0.31796406]

            if ENABLE_COLOR_CUSTOMIZATION:
                try:
                    import numpy as np
                    
                    def swap_colors(color):
                        """Helper function to swap red and blue colors"""
                        try:
                            if len(color) >= 3:
                                r, g, b = color[0], color[1], color[2]
                                alpha = color[3] if len(color) > 3 else 1.0
                                
                                # Check if this is a red-ish color (positive SHAP value)
                                if r > g and r > b and r > 0.5:
                                    # Convert red to blue
                                    if len(color) > 3:
                                        return BLUE_NORMALIZED + [alpha]
                                    else:
                                        return BLUE_NORMALIZED
                                # Check if this is a blue-ish color (negative SHAP value)
                                elif b > r and b > g and b > 0.5:
                                    # Convert blue to red
                                    if len(color) > 3:
                                        return RED_NORMALIZED + [alpha]
                                    else:
                                        return RED_NORMALIZED
                        except (IndexError, TypeError):
                            pass
                        return color
                    
                    for ax in fig.get_axes():
                        # Handle collections (bars, lines, etc.)
                        for collection in ax.collections:
                            try:
                                if hasattr(collection, 'get_facecolors'):
                                    colors = collection.get_facecolors()
                                    if len(colors) > 0:
                                        new_colors = [swap_colors(color) for color in colors]
                                        collection.set_facecolors(new_colors)
                                
                                if hasattr(collection, 'get_edgecolors'):
                                    colors = collection.get_edgecolors()
                                    if len(colors) > 0:
                                        new_colors = [swap_colors(color) for color in colors]
                                        collection.set_edgecolors(new_colors)
                            except Exception as e:
                                logger.warning(f"Error processing collection colors: {e}")
                                continue
                        
                        # Handle patches (rectangles in waterfall plots)
                        for patch in ax.patches:
                            try:
                                if hasattr(patch, 'get_facecolor'):
                                    color = patch.get_facecolor()
                                    new_color = swap_colors(color)
                                    # Use numpy array comparison to avoid ambiguity
                                    if not np.array_equal(new_color, color):
                                        patch.set_facecolor(new_color)
                                
                                if hasattr(patch, 'get_edgecolor'):
                                    color = patch.get_edgecolor()
                                    new_color = swap_colors(color)
                                    if not np.array_equal(new_color, color):
                                        patch.set_edgecolor(new_color)
                            except Exception as e:
                                logger.warning(f"Error processing patch colors: {e}")
                                continue
                        
                        # Handle text elements
                        for text in ax.texts:
                            try:
                                if hasattr(text, 'get_color'):
                                    color = text.get_color()
                                    # Handle matplotlib color objects properly
                                    if hasattr(color, '__len__') and len(color) >= 3:
                                        new_color = swap_colors(color)
                                        # Use numpy array comparison to avoid ambiguity
                                        if not np.array_equal(new_color, color):
                                            text.set_color(new_color)
                                    elif isinstance(color, str):
                                        # Handle named colors like 'red', 'blue', etc.
                                        if color.lower() in ['red', 'darkred', 'crimson']:
                                            text.set_color('blue')
                                        elif color.lower() in ['blue', 'darkblue', 'navy']:
                                            text.set_color('red')
                            except Exception as e:
                                logger.warning(f"Error processing text colors: {e}")
                                continue
                                
                except Exception as e:
                    logger.warning(f"Error in color customization: {e}. Proceeding with original colors.")
            
            img_bytes = io.BytesIO()
            fig.savefig(img_bytes, format='png', bbox_inches='tight', dpi=100)
            img_bytes.seek(0)
            img_b64 = base64.b64encode(img_bytes.read()).decode('utf-8')
            plt.close(fig)
            
            logger.info(f"Waterfall plot generated successfully!")

            return img_b64
            
    except Exception as e:
        logger.error(f"Error generating waterfall plot for {model_name}: {e}")
        # Return a placeholder image or raise the error
        raise RuntimeError(f"Failed to generate waterfall plot: {str(e)}")