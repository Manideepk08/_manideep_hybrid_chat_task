#!/bin/bash
# Full development script - starts both backend and frontend (Linux/macOS)

echo "Starting Hybrid Chat Full Development Environment..."

# Function to start backend
start_backend() {
    echo "Starting backend..."
    gnome-terminal -- bash -c './scripts/dev-backend.sh; exec bash' 2>/dev/null || \
    xterm -e './scripts/dev-backend.sh' 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "./scripts/dev-backend.sh"' 2>/dev/null || \
    echo "Please run './scripts/dev-backend.sh' in a separate terminal"
}

# Function to start frontend
start_frontend() {
    echo "Starting frontend..."
    sleep 3  # Give backend time to start
    gnome-terminal -- bash -c './scripts/dev-frontend.sh; exec bash' 2>/dev/null || \
    xterm -e './scripts/dev-frontend.sh' 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "./scripts/dev-frontend.sh"' 2>/dev/null || \
    echo "Please run './scripts/dev-frontend.sh' in a separate terminal"
}

# Start both services
start_backend
start_frontend

echo "Both services are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"

