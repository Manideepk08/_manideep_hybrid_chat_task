# Initial setup script (Windows PowerShell)
Write-Host "Setting up Hybrid Chat Development Environment..." -ForegroundColor Green

# Check Python version
try {
    $pythonVersion = python --version
    Write-Host "Python version: $pythonVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Python is not installed. Please install Python 3.11+ from https://python.org/" -ForegroundColor Red
    exit 1
}

# Check Node.js version
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
python -m venv .venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
python -m pip install --upgrade pip
pip install -r requirements-api.txt

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "To start development:" -ForegroundColor Cyan
Write-Host "  .\scripts\dev-full.ps1" -ForegroundColor White
Write-Host "To start backend only:" -ForegroundColor Cyan
Write-Host "  .\scripts\dev-backend.ps1" -ForegroundColor White
Write-Host "To start frontend only:" -ForegroundColor Cyan
Write-Host "  .\scripts\dev-frontend.ps1" -ForegroundColor White

