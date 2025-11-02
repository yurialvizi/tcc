FROM python:3.12-slim

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy saved_models and metadata first (these change less frequently)
# This optimizes Docker layer caching - model changes won't invalidate code layers
COPY saved_models/ ./saved_models/
COPY metadata/ ./metadata/

# Copy application code (includes any data/ folder if present)
COPY . .

EXPOSE 5000

# Use gunicorn for production (better for Cloud Run)
# Fallback to python app.py for development
CMD exec gunicorn --bind :5000 --workers 2 --threads 4 --timeout 300 --chdir /app wsgi:application