FROM python:3.12-slim

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 5000

# Use gunicorn for production (better for Cloud Run)
# Fallback to python app.py for development
CMD exec gunicorn --bind :5000 --workers 2 --threads 4 --timeout 300 --chdir /app wsgi:application