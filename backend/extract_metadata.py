#!/usr/bin/env python3
"""
Extract metadata (metrics, SHAP data) from model files to create lightweight metadata files
This allows true lazy loading without loading full models at startup
"""

import joblib
import json
import os
from pathlib import Path

def extract_metadata():
    """Extract metadata from all model files"""
    base_dir = Path(__file__).parent
    saved_models_dir = base_dir / 'saved_models'
    metadata_dir = base_dir / 'metadata'
    
    # Create metadata directory
    metadata_dir.mkdir(exist_ok=True)
    
    model_files = {
        "logistic-regression": "logistic_regression.pkl",
        "random-forest": "random_forest.pkl", 
        "xg-boost": "xgboost.pkl",
        "mlp": "mlp.pkl"
    }
    
    for model_name, filename in model_files.items():
        model_path = saved_models_dir / filename
        
        if not model_path.exists():
            print(f"⚠️  Model file not found: {model_path}")
            continue
            
        try:
            print(f"🔄 Extracting metadata from {model_name}...")
            
            # Load the full model file
            data = joblib.load(model_path)
            
            # Extract only metadata, handling non-serializable objects
            metrics = data.get('metrics', {})
            shap_data = data.get('shap', {})
            
            # Convert metrics to JSON-serializable format
            serializable_metrics = {}
            for key, value in metrics.items():
                try:
                    json.dumps(value)  # Test if serializable
                    serializable_metrics[key] = value
                except (TypeError, ValueError):
                    # Convert non-serializable objects to strings
                    serializable_metrics[key] = str(value)
            
            # Handle SHAP data - only keep essential info, not the full data
            serializable_shap = {}
            for key, value in shap_data.items():
                if key in ['summary_plot', 'shap_importance']:
                    # Keep these as they're base64 strings
                    serializable_shap[key] = value
                elif key == 'masker':
                    # Skip masker as it's usually a large object
                    continue
                else:
                    try:
                        json.dumps(value)
                        serializable_shap[key] = value
                    except (TypeError, ValueError):
                        serializable_shap[key] = str(value)
            
            metadata = {
                "metrics": serializable_metrics,
                "shap": serializable_shap
            }
            
            # Save metadata to separate file
            metadata_file = metadata_dir / f"{model_name}_metadata.json"
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            print(f"✅ Metadata extracted for {model_name}")
            print(f"   📁 Saved to: {metadata_file}")
            
            # Show file sizes
            model_size = model_path.stat().st_size / (1024 * 1024)
            metadata_size = metadata_file.stat().st_size / 1024
            print(f"   📊 Model size: {model_size:.1f}MB")
            print(f"   📊 Metadata size: {metadata_size:.1f}KB")
            print()
            
        except Exception as e:
            print(f"❌ Error extracting metadata from {model_name}: {e}")

if __name__ == "__main__":
    extract_metadata()
