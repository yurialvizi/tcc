"""
WSGI entry point for production deployment
This file is used by Gunicorn to serve the Flask application
"""

import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Import the Flask app
from app import app

# This is what Gunicorn will use to serve the application
application = app

if __name__ == "__main__":
    # This won't be used in production, but useful for testing
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
