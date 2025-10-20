#!/bin/bash
# Development script for backend (Linux/macOS)

echo "Starting Hybrid Chat Backend Development Server..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install/upgrade dependencies
echo "Installing dependencies..."
python -m pip install --upgrade pip
pip install -r requirements-api.txt

# Start the FastAPI server
echo "Starting FastAPI server on http://localhost:8000"
echo "API docs available at http://localhost:8000/docs"
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

