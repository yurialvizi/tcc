import joblib
import os
import json
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class ModelLoader:
    """
    Eager loading system for models - loads all models at startup
    Optimized for environments with sufficient memory (2GB+)
    """
    def __init__(self, model_paths: Dict[str, str]):
        self.model_paths = model_paths
        self.base_dir = os.path.dirname(__file__)
        self._models = {}
        self._metrics = {}
        self._shap = {}
        self._scalers = {}
        
        # Load all models immediately
        logger.info("🔄 Loading all models eagerly...")
        self._load_all_models()
        logger.info(f"✅ All {len(self._models)} models loaded successfully!")
    
    def _load_all_models(self):
        """Load all models at startup"""
        for name, path in self.model_paths.items():
            try:
                full_path = os.path.join(self.base_dir, '..', path)
                logger.info(f"🔄 Loading model {name}...")
                
                data = joblib.load(full_path)
                self._models[name] = data['model']
                
                # Load metrics
                if 'metrics' in data:
                    self._metrics[name] = data['metrics']
                else:
                    # Try to load from metadata file
                    metadata_path = os.path.join(self.base_dir, '..', f'metadata/{name}_metadata.json')
                    if os.path.exists(metadata_path):
                        with open(metadata_path, 'r') as f:
                            metadata = json.load(f)
                            self._metrics[name] = metadata.get('metrics', {})
                    else:
                        self._metrics[name] = {}
                
                # Load SHAP data
                if 'shap' in data:
                    self._shap[name] = data['shap']
                else:
                    # Try to load from metadata file
                    metadata_path = os.path.join(self.base_dir, '..', f'metadata/{name}_metadata.json')
                    if os.path.exists(metadata_path):
                        with open(metadata_path, 'r') as f:
                            metadata = json.load(f)
                            self._shap[name] = metadata.get('shap', {})
                    else:
                        self._shap[name] = {}
                
                # Load scaler if it exists
                if 'scaler' in data:
                    self._scalers[name] = data['scaler']
                
                logger.info(f"✅ Model {name} loaded successfully")
                
            except Exception as e:
                logger.error(f"❌ Error loading model {name}: {e}")
                # Create minimal defaults to prevent crashes
                self._models[name] = None
                self._metrics[name] = {}
                self._shap[name] = {}
    
    def get_model(self, model_name: str):
        """Get a model (already loaded)"""
        if model_name not in self._models:
            raise ValueError(f"Model {model_name} not found")
        if self._models[model_name] is None:
            raise ValueError(f"Model {model_name} failed to load")
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
        """Get list of all loaded models"""
        return list(self._models.keys())
    
    @property
    def all_loaded(self) -> bool:
        """Check if all models are loaded"""
        return len(self._models) == len(self.model_paths) and all(
            self._models[name] is not None for name in self.model_paths.keys()
        )
