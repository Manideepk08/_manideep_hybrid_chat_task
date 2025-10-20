# Production script for backend (Windows PowerShell)
Write-Host "Starting Hybrid Chat Backend in Production Mode..." -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Install/upgrade dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
python -m pip install --upgrade pip
pip install -r requirements-api.txt

# Start the FastAPI server in production mode
Write-Host "Starting FastAPI server in production mode on http://localhost:8000" -ForegroundColor Green
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4

