# Hybrid Chat Frontend - Vietnam Travel Assistant

A modern web interface for the Hybrid Chat system that combines vector search (Pinecone) with knowledge graphs (Neo4j) and LLMs to provide comprehensive Vietnam travel recommendations.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+ (for backend)
- Node.js 18+ (for frontend)
- Neo4j database (local or Aura)
- Pinecone account and API key
- OpenAI or Google API key

### 1. Initial Setup
```powershell
# Windows PowerShell
.\scripts\setup.ps1
```

```bash
# Linux/macOS
chmod +x scripts/*.sh
./scripts/setup.sh  # Create this if needed
```

### 2. Configure API Keys
Edit `config.py` with your credentials:
```python
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "<your-password>"

OPENAI_API_KEY = "sk-proj-..."
# OR
GOOGLE_API_KEY = "<your-google-api-key>"
CHAT_PROVIDER = "google"

PINECONE_API_KEY = "pcsk_..."
PINECONE_ENV = "us-east1-gcp"
PINECONE_INDEX_NAME = "vietnam-travel"
PINECONE_VECTOR_DIM = 1024  # For BAAI/bge-m3
```

### 3. Load Data
```powershell
# Load data into Neo4j
python load_to_neo4j.py

# Upload vectors to Pinecone
python pinecone_upload.py
```

### 4. Start Development Servers

**Option A: Start Both Services**
```powershell
# Windows
.\scripts\dev-full.ps1
```

```bash
# Linux/macOS
./scripts/dev-full.sh
```

**Option B: Start Separately**
```powershell
# Backend only (Terminal 1)
.\scripts\dev-backend.ps1

# Frontend only (Terminal 2)
.\scripts\dev-frontend.ps1
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🏗️ Architecture

### Backend (FastAPI)
- **API Endpoints**:
  - `POST /api/chat` - Process chat queries
  - `POST /api/search` - Vector similarity search
  - `GET /api/graph/byIds` - Get graph data for visualization
  - `GET /api/health` - Health check

- **Services**:
  - `ChatService` - Main business logic
  - Vector search with Pinecone
  - Graph queries with Neo4j
  - LLM integration (OpenAI/Gemini)

### Frontend (React + TypeScript)
- **Pages**:
  - `/` - Chat interface
  - `/graph` - Interactive graph visualization
  - `/about` - System information

- **Components**:
  - `ChatInput` - Query input with send functionality
  - `MessageList` - Chat history display
  - `MatchList` - Vector search results
  - `GraphFactsList` - Graph relationship data
  - `GraphView` - Interactive network visualization

- **Features**:
  - Real-time chat interface
  - Markdown rendering for responses
  - Interactive graph visualization
  - Node selection for graph exploration
  - Responsive design with TailwindCSS

## 🛠️ Development

### Backend Development
```powershell
# Start backend with hot reload
.\scripts\dev-backend.ps1
```

### Frontend Development
```powershell
# Start frontend with hot reload
.\scripts\dev-frontend.ps1
```

### Building for Production
```powershell
# Build frontend
.\scripts\build-frontend.ps1

# Start production backend
.\scripts\prod-backend.ps1
```

## 📁 Project Structure

```
hybrid_chat/
├── api/                    # FastAPI backend
│   ├── main.py            # API routes and app setup
│   └── __init__.py
├── services/              # Business logic
│   ├── chat_service.py    # Main chat service
│   └── __init__.py
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   └── main.tsx       # App entry point
│   ├── package.json
│   └── vite.config.ts
├── scripts/               # Development scripts
│   ├── dev-backend.ps1    # Backend dev server
│   ├── dev-frontend.ps1   # Frontend dev server
│   ├── dev-full.ps1       # Both servers
│   ├── setup.ps1          # Initial setup
│   └── *.sh               # Linux/macOS versions
├── requirements-api.txt    # Backend dependencies
├── config.py              # Configuration
├── load_to_neo4j.py       # Data loading
├── pinecone_upload.py     # Vector upload
└── hybrid_chat.py         # Original CLI version
```

## 🔧 Configuration

### Environment Variables
The system uses `config.py` for configuration. Key settings:

- **Database**: Neo4j connection details
- **Vector DB**: Pinecone API key and index settings
- **LLM**: OpenAI or Google API key and model selection
- **Embeddings**: BAAI/bge-m3 model configuration

### Frontend Configuration
- API base URL: `http://localhost:8000` (development)
- CORS enabled for localhost origins
- React Query for data fetching and caching

## 🚀 Deployment

### Development
Use the provided scripts for local development with hot reload.

### Production
1. Build the frontend: `.\scripts\build-frontend.ps1`
2. Serve static files from `frontend/dist/`
3. Run backend with production settings: `.\scripts\prod-backend.ps1`
4. Configure reverse proxy (Nginx) for production

### Docker (Optional)
```dockerfile
# Example Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements-api.txt .
RUN pip install -r requirements-api.txt
COPY . .
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🧪 Testing

### API Testing
```bash
# Health check
curl http://localhost:8000/api/health

# Chat query
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "3-day Hanoi itinerary"}'
```

### Frontend Testing
The frontend includes error handling and loading states. Check browser console for any issues.

## 📊 Features

### Chat Interface
- Natural language queries about Vietnam travel
- Real-time responses with context
- Markdown rendering for formatted answers
- Copy-to-clipboard functionality

### Graph Visualization
- Interactive network graph using Vis.js
- Node selection from search results
- Relationship exploration
- Responsive design

### Search Results
- Vector similarity scores
- Metadata display (name, type, city)
- Add to graph functionality
- Filtering and sorting

## 🔍 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check Python version (3.11+)
   - Verify virtual environment activation
   - Check API keys in `config.py`

2. **Frontend won't start**
   - Check Node.js version (18+)
   - Run `npm install` in frontend directory
   - Check port 5173 availability

3. **API connection errors**
   - Verify backend is running on port 8000
   - Check CORS settings
   - Verify API endpoints in browser dev tools

4. **Database connection issues**
   - Check Neo4j is running
   - Verify connection details in `config.py`
   - Test with `python load_to_neo4j.py`

### Logs
- Backend logs: Check terminal running the backend
- Frontend logs: Check browser developer console
- API logs: Available at http://localhost:8000/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- BAAI for the bge-m3 embedding model
- Pinecone for vector database services
- Neo4j for graph database
- OpenAI and Google for LLM services
- React and Vite communities for excellent tooling

