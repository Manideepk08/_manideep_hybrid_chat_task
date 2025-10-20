# Hybrid Chat: Vector + Graph RAG for Vietnam Travel

A comprehensive travel assistant that combines vector search (Pinecone) with knowledge graphs (Neo4j) and Large Language Models (OpenAI/Google Gemini) to provide intelligent answers about Vietnam travel. The system features both a modern web interface and a command-line interface for different use cases.

## 🌟 Features

### Core Capabilities
- **Hybrid RAG Architecture**: Combines vector similarity search with graph-based knowledge retrieval
- **Multi-Modal Interface**: Modern React web app + CLI interface
- **Real-time Chat**: Interactive conversation with context-aware responses
- **Graph Visualization**: Interactive network visualization of travel relationships
- **Vector Search**: Semantic search using BAAI/bge-m3 embeddings
- **Knowledge Graph**: Structured data storage in Neo4j with relationships

### Web Interface Features
- **Modern UI**: Built with React, TypeScript, and TailwindCSS
- **Interactive Graph**: Vis.js-powered network visualization
- **Real-time Search**: Live vector similarity search results
- **Markdown Rendering**: Rich text responses with formatting
- **Responsive Design**: Works on desktop and mobile devices
- **API Integration**: RESTful API with FastAPI backend

### CLI Features
- **Interactive Chat**: Command-line interface for quick queries
- **Graph Export**: Generate HTML visualizations of the knowledge graph
- **Batch Processing**: Efficient data loading and vector upload

## 🏗️ Architecture

### Backend (FastAPI)
```
api/
├── main.py              # FastAPI application with CORS
└── __init__.py

services/
├── chat_service.py      # Main business logic with Neo4j
├── chat_service_fallback.py  # Fallback without Neo4j
└── __init__.py
```

**API Endpoints:**
- `POST /api/chat` - Process chat queries with hybrid RAG
- `POST /api/search` - Vector similarity search
- `GET /api/graph/byIds` - Get graph data for visualization
- `GET /api/health` - Health check endpoint

### Frontend (React + TypeScript)
```
frontend/src/
├── components/
│   ├── ChatInput.tsx    # Query input component
│   ├── MessageList.tsx  # Chat history display
│   ├── MatchList.tsx    # Vector search results
│   ├── GraphFactsList.tsx  # Graph relationship data
│   ├── GraphView.tsx    # Interactive network visualization
│   └── Layout.tsx       # Main layout component
├── pages/
│   ├── ChatPage.tsx     # Main chat interface
│   ├── GraphPage.tsx    # Graph visualization page
│   └── AboutPage.tsx    # System information
├── services/
│   └── api.ts           # API client with React Query
└── types/
    └── index.ts         # TypeScript type definitions
```

### Data Flow
1. **User Query** → Frontend/CLI
2. **Vector Search** → Pinecone (semantic similarity)
3. **Graph Query** → Neo4j (relationship context)
4. **LLM Processing** → OpenAI/Gemini (response generation)
5. **Response** → User with context and visualizations

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** (tested with 3.13)
- **Node.js 18+** (for frontend development)
- **Neo4j** (local Desktop/Server or Aura Cloud)
- **API Keys**:
  - Pinecone (vector database)
  - OpenAI or Google Generative AI (LLM)
  - Neo4j credentials

### 1. Clone and Setup Environment

**Windows PowerShell:**
```powershell
cd C:\Users\HP\OneDrive\Desktop\hybrid_chat
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements-api.txt
```

**Linux/macOS:**
```bash
cd hybrid_chat
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements-api.txt
```

### 2. Configure API Keys

Edit `config.py` with your credentials:

```python
# Neo4j Configuration
NEO4J_URI = "bolt://localhost:7687"  # or Neo4j Aura URI
NEO4J_DATABASE = "neo4j"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "<your-password>"

# LLM Configuration
OPENAI_API_KEY = "sk-proj-..."  # OpenAI API key
GOOGLE_API_KEY = "AIzaSy..."    # Optional: Google API key
CHAT_PROVIDER = "openai"         # or "google"

# Pinecone Configuration
PINECONE_API_KEY = "pcsk_..."
PINECONE_CLOUD = "aws"           # or "gcp"
PINECONE_ENV = "us-east-1"       # match your region
PINECONE_INDEX_NAME = "vietnam-travel"
PINECONE_VECTOR_DIM = 1024       # BAAI/bge-m3 dimension
```

### 3. Load Data

**Load data into Neo4j:**
```powershell
python load_to_neo4j.py
```

**Upload vectors to Pinecone:**
```powershell
python pinecone_upload.py
```

### 4. Start the Application

#### Option A: Web Interface (Recommended)
```powershell
# Start both backend and frontend
.\scripts\dev-full.ps1
```

#### Option B: Start Separately
```powershell
# Terminal 1: Backend
.\scripts\dev-backend.ps1

# Terminal 2: Frontend
.\scripts\dev-frontend.ps1
```

#### Option C: CLI Only
```powershell
python hybrid_chat.py
```

### 5. Access the Application
- **Web Interface**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **Backend API**: http://localhost:8000

## 🛠️ Development

### Available Scripts

**Windows PowerShell:**
- `.\scripts\setup.ps1` - Initial project setup
- `.\scripts\dev-backend.ps1` - Start backend with hot reload
- `.\scripts\dev-frontend.ps1` - Start frontend with hot reload
- `.\scripts\dev-full.ps1` - Start both services
- `.\scripts\build-frontend.ps1` - Build frontend for production
- `.\scripts\prod-backend.ps1` - Start production backend

**Linux/macOS:**
- `./scripts/dev-backend.sh` - Start backend
- `./scripts/dev-frontend.sh` - Start frontend
- `./scripts/dev-full.sh` - Start both services

### Project Structure
```
hybrid_chat/
├── api/                    # FastAPI backend
│   ├── main.py            # API routes and app setup
│   └── __init__.py
├── services/              # Business logic
│   ├── chat_service.py    # Main chat service with Neo4j
│   ├── chat_service_fallback.py  # Fallback service
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
├── load_to_neo4j.py       # Data loading to Neo4j
├── pinecone_upload.py     # Vector upload to Pinecone
├── hybrid_chat.py         # CLI version
├── visualize_graph.py     # Graph visualization
└── vietnam_travel_dataset.json  # Source dataset
```

## 🔧 Configuration Details

### Models and Embeddings
- **Embeddings**: BAAI/bge-m3 (1024 dimensions)
- **Chat Models**: 
  - OpenAI: `gpt-3.5-turbo` or `gpt-4`
  - Google: `gemini-1.5-flash`
- **Vector Database**: Pinecone Serverless
- **Graph Database**: Neo4j with Cypher queries

### Environment Variables
All configuration is managed through `config.py`:

- **Database**: Neo4j connection details and credentials
- **Vector DB**: Pinecone API key, environment, and index settings
- **LLM**: API keys and model selection for OpenAI/Google
- **Embeddings**: Model configuration and dimension settings

### Frontend Configuration
- **API Base URL**: `http://localhost:8000` (development)
- **CORS**: Enabled for localhost origins
- **State Management**: React Query for data fetching and caching
- **Styling**: TailwindCSS with responsive design

## 📊 How It Works

### Hybrid RAG Process
1. **Query Processing**: User input is embedded using BAAI/bge-m3
2. **Vector Search**: Pinecone returns top-k similar documents
3. **Graph Context**: Neo4j provides relationship data for matched entities
4. **Prompt Construction**: Combines vector matches with graph facts
5. **LLM Generation**: OpenAI/Gemini generates contextual response
6. **Response Delivery**: Returns answer with source context

### Data Loading Pipeline
1. **Dataset**: `vietnam_travel_dataset.json` contains travel entities
2. **Neo4j**: Nodes created with labels from `type` field, relationships from dataset
3. **Pinecone**: Text embeddings stored with metadata (id, name, type, city)
4. **Visualization**: PyVis generates interactive HTML graphs

## 🚀 Deployment

### Development
Use the provided scripts for local development with hot reload:
```powershell
.\scripts\dev-full.ps1
```

### Production
1. **Build Frontend**:
   ```powershell
   .\scripts\build-frontend.ps1
   ```

2. **Start Production Backend**:
   ```powershell
   .\scripts\prod-backend.ps1
   ```

3. **Configure Reverse Proxy** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/hybrid_chat/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Docker Deployment
```dockerfile
# Backend Dockerfile
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

# Vector search
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "best restaurants", "top_k": 5}'
```

### Frontend Testing
- Open browser developer tools
- Check console for errors
- Test API connectivity
- Verify responsive design

## 🔍 Troubleshooting

### Common Issues

**Backend Issues:**
- **Python Version**: Ensure Python 3.11+ is installed
- **Virtual Environment**: Activate venv before running
- **API Keys**: Verify all keys in `config.py` are valid
- **Dependencies**: Run `pip install -r requirements-api.txt`

**Frontend Issues:**
- **Node.js Version**: Ensure Node.js 18+ is installed
- **Dependencies**: Run `npm install` in frontend directory
- **Port Conflicts**: Check ports 5173 and 8000 are available

**Database Issues:**
- **Neo4j Connection**: Verify database is running and credentials are correct
- **Pinecone Index**: Ensure index exists and dimensions match
- **Data Loading**: Test with `python load_to_neo4j.py` and `python pinecone_upload.py`

**API Connection Issues:**
- **CORS**: Check CORS settings in `api/main.py`
- **Network**: Verify backend is running on port 8000
- **Endpoints**: Test with API documentation at `/docs`

### Debugging Tips
- Check backend logs in terminal
- Use browser developer tools for frontend issues
- Test API endpoints with curl or Postman
- Verify configuration in `config.py`

## 📈 Performance Optimization

### Backend Optimizations
- **Connection Pooling**: Neo4j driver uses connection pooling
- **Batch Processing**: Vector uploads use batching
- **Caching**: Consider Redis for frequently accessed data

### Frontend Optimizations
- **React Query**: Automatic caching and background updates
- **Code Splitting**: Vite handles automatic code splitting
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all scripts work on Windows and Linux/macOS

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **BAAI** for the bge-m3 embedding model
- **Pinecone** for vector database services
- **Neo4j** for graph database technology
- **OpenAI** and **Google** for LLM services
- **React** and **Vite** communities for excellent tooling
- **FastAPI** for the modern Python web framework

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Open an issue on GitHub
4. Check existing issues for solutions

---

**Happy Travel Planning! 🇻🇳**