import joblib
import os
import json
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class LazyModelLoader:
    """
    True lazy loading system for models to minimize memory usage
    Only loads models when actually needed for prediction
    """
    def __init__(self, model_paths: Dict[str, str]):
        self.model_paths = model_paths
        self.base_dir = os.path.dirname(__file__)
        self._models = {}
        self._metrics = {}
        self._shap = {}
        self._scalers = {}
        self._loaded_models = set()
        
        # Load only lightweight metadata (metrics and SHAP data)
        self._load_lightweight_metadata()
    
    def _load_lightweight_metadata(self):
        """Load only metrics and SHAP data from separate files or create defaults"""
        for name, path in self.model_paths.items():
            try:
                # Try to load from separate metadata files first
                metadata_path = os.path.join(self.base_dir, '..', f'metadata/{name}_metadata.json')
                if os.path.exists(metadata_path):
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                        self._metrics[name] = metadata.get('metrics', {})
                        self._shap[name] = metadata.get('shap', {})
                        logger.info(f"✅ Loaded metadata from file for {name}")
                else:
                    # Create default metadata to avoid loading full model
                    self._metrics[name] = {
                        "accuracy": 0.0,
                        "precision": 0.0,
                        "recall": 0.0,
                        "f1_score": 0.0
                    }
                    self._shap[name] = {
                        "summary_plot": None,
                        "shap_importance": None,
                        "masker": None
                    }
                    logger.info(f"✅ Created default metadata for {name}")
                    
            except Exception as e:
                logger.error(f"❌ Error loading metadata for {name}: {e}")
                # Create minimal defaults
                self._metrics[name] = {}
                self._shap[name] = {}
    
    def _load_model(self, model_name: str):
        """Load a specific model when needed"""
        if model_name in self._loaded_models:
            return
        
        if model_name not in self.model_paths:
            raise ValueError(f"Model {model_name} not found")
        
        full_path = os.path.join(self.base_dir, '..', self.model_paths[model_name])
        try:
            logger.info(f"🔄 Loading model {model_name}...")
            data = joblib.load(full_path)
            self._models[model_name] = data['model']
            
            # Update metrics and SHAP data from the loaded model
            if 'metrics' in data:
                self._metrics[model_name] = data['metrics']
            if 'shap' in data:
                self._shap[model_name] = data['shap']
            if 'scaler' in data:
                self._scalers[model_name] = data['scaler']
            
            self._loaded_models.add(model_name)
            logger.info(f"✅ Model {model_name} loaded successfully")
        except Exception as e:
            logger.error(f"❌ Error loading model {model_name}: {e}")
            raise
    
    def get_model(self, model_name: str):
        """Get a model, loading it if necessary"""
        if model_name not in self._loaded_models:
            self._load_model(model_name)
        return self._models[model_name]
    
    def get_metrics(self, model_name: str = None):
        """Get metrics for a specific model or all models"""
        if model_name:
            return self._metrics.get(model_name)
        return self._metrics
    
    def get_shap(self, model_name: str):
        """Get SHAP data for a model"""
        return self._shap.get(model_name)
    
    def get_scaler(self, model_name: str):
        """Get scaler for a model"""
        return self._scalers.get(model_name)
    
    def get_loaded_models(self):
        """Get list of currently loaded models"""
        return list(self._loaded_models)
    
    def unload_model(self, model_name: str):
        """Unload a model to free memory"""
        if model_name in self._loaded_models:
            del self._models[model_name]
            self._loaded_models.remove(model_name)
            logger.info(f"🗑️ Unloaded model {model_name}")
    
    def unload_all_models(self):
        """Unload all models to free memory"""
        for model_name in list(self._loaded_models):
            self.unload_model(model_name)

# Legacy function for backward compatibility
def load_models(model_paths) -> tuple[Dict, Dict]:
    """
    Legacy function - now returns a LazyModelLoader instance
    """
    loader = LazyModelLoader(model_paths)
    return loader, loader._metrics, loader._shap, loader._scalers