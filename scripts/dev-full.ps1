# Full development script - starts both backend and frontend (Windows PowerShell)
Write-Host "Starting Hybrid Chat Full Development Environment..." -ForegroundColor Green

# Function to start backend
function Start-Backend {
    Write-Host "Starting backend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '.\scripts\dev-backend.ps1'"
}

# Function to start frontend
function Start-Frontend {
    Write-Host "Starting frontend..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3  # Give backend time to start
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '.\scripts\dev-frontend.ps1'"
}

# Start both services
Start-Backend
Start-Frontend

Write-Host "Both services are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan

