"""
Utility to download saved models from Google Drive
Used by the Flask app to ensure models are available at startup
"""

import os
import sys
from pathlib import Path
import logging
import shutil

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def download_models_from_gdrive():
    """
    Download models and data folder from Google Drive if any files are missing locally
    """
    try:
        import gdown
    except ImportError:
        logger.error("gdown not installed. Please add gdown to requirements.txt")
        return False
    
    FOLDER_ID = '1JsWol8h8m6f_mjFfOcJkz784FGC178vb'
    
    if FOLDER_ID.startswith('YOUR_'):
        logger.warning("⚠️  Please update the Google Drive folder ID in utils/model_downloader.py")
        return False
    
    # Get the directory where this script is located
    current_dir = Path(__file__).parent
    saved_models_dir = current_dir.parent / 'saved_models'  # Go up one level to backend/saved_models
    
    # Create saved_models directory if it doesn't exist
    saved_models_dir.mkdir(exist_ok=True)
    
    # Check if all models exist and are valid
    required_models = [
        'logistic_regression.pkl',
        'mlp.pkl', 
        'random_forest.pkl',
        'xgboost.pkl'
    ]
    
    # Check if synthetic sample data exists
    # data_dir = current_dir.parent / 'data'
    # data_dir.mkdir(exist_ok=True)
    # synthetic_sample_path = data_dir / 'syntetic_sample.csv'
    
    missing_models = []
    for model in required_models:
        model_path = saved_models_dir / model
        if not model_path.exists() or model_path.stat().st_size < 1024 * 1024:  # Less than 1MB
            missing_models.append(model)
    
    missing_data = []
    # if not synthetic_sample_path.exists() or synthetic_sample_path.stat().st_size < 1024:  # Less than 1KB
    #     missing_data.append('syntetic_sample.csv')
    
    if not missing_models and not missing_data:
        logger.info("✅ All models and data already present locally!")
        return True
    
    logger.info(f"📥 Missing models: {missing_models}")
    # logger.info(f"📥 Missing data: {missing_data}")
    logger.info("🚀 Downloading models and data folder from Google Drive...")
    
    try:
        # Create a temporary directory for the download
        temp_dir = current_dir.parent / 'temp_models'
        temp_dir.mkdir(exist_ok=True)
        
        # Download the entire folder
        folder_url = f"https://drive.google.com/drive/folders/{FOLDER_ID}"
        logger.info(f"📁 Downloading folder from: {folder_url}")
        
        # Use gdown to download the folder
        gdown.download_folder(folder_url, output=str(temp_dir), quiet=False, use_cookies=False)
        
        # Move downloaded files to appropriate directories
        downloaded_pkl_files = list(temp_dir.rglob('*.pkl'))
        # downloaded_csv_files = list(temp_dir.rglob('*.csv'))
        
        logger.info(f"📦 Found {len(downloaded_pkl_files)} .pkl files in downloaded folder")
        
        moved_models = 0
        # moved_data = 0
        
        # Move model files
        for pkl_file in downloaded_pkl_files:
            filename = pkl_file.name
            destination = saved_models_dir / filename
            
            # Only move files that are in our required list
            if filename in required_models:
                shutil.move(str(pkl_file), str(destination))
                logger.info(f"✅ Moved model {filename} ({destination.stat().st_size / (1024*1024):.1f}MB)")
                moved_models += 1
            else:
                logger.info(f"ℹ️  Skipping {filename} (not in required models)")
        
        # Move data files
        # for csv_file in downloaded_csv_files:
        #     filename = csv_file.name
        #     if filename == 'syntetic_sample.csv':
        #         destination = data_dir / filename
        #         shutil.move(str(csv_file), str(destination))
        #         logger.info(f"✅ Moved data {filename} ({destination.stat().st_size / (1024*1024):.1f}MB)")
        #         moved_data += 1
        #     else:
        #         logger.info(f"ℹ️  Skipping {filename} (not required data file)")
        
        # Clean up temporary directory
        shutil.rmtree(temp_dir, ignore_errors=True)
        
        total_moved = moved_models
        if total_moved > 0:
            logger.info(f"🎉 Successfully downloaded {moved_models} models!")
        else:
            logger.warning("⚠️  No files were downloaded. Check your folder ID and folder structure.")
            
        return True
        
    except Exception as e:
        logger.error(f"❌ Error downloading models folder: {e}")
        # Clean up temporary directory on error
        temp_dir = current_dir.parent / 'temp_models'
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
        return False

def check_models_available():
    """
    Check if all required models and data are available
    """
    current_dir = Path(__file__).parent
    saved_models_dir = current_dir.parent / 'saved_models'  # Go up one level to backend/saved_models
    # data_dir = current_dir.parent / 'data'
    
    required_models = [
        'logistic_regression.pkl',
        'mlp.pkl', 
        'random_forest.pkl',
        'xgboost.pkl'
    ]
    
    missing_models = []
    for model in required_models:
        model_path = saved_models_dir / model
        if not model_path.exists() or model_path.stat().st_size < 1024 * 1024:  # Less than 1MB
            missing_models.append(model)
    
    missing_data = []
    # synthetic_sample_path = data_dir / 'syntetic_sample.csv'
    # if not synthetic_sample_path.exists() or synthetic_sample_path.stat().st_size < 1024:  # Less than 1KB
        # missing_data.append('syntetic_sample.csv')
    
    all_missing = missing_models + missing_data
    return len(all_missing) == 0, all_missing

