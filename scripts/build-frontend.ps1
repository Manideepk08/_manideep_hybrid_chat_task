# Build script for frontend (Windows PowerShell)
Write-Host "Building Hybrid Chat Frontend for Production..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location frontend

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

# Build the frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

Write-Host "Frontend build completed!" -ForegroundColor Green
Write-Host "Build files are in: frontend/dist/" -ForegroundColor Cyan

