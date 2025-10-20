# api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sys
import os

# Add parent directory to path to import services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to import the main chat service, fallback to the version without Neo4j
try:
    from services.chat_service import chat_service
    print("✅ Using full chat service with Neo4j")
except Exception as e:
    print(f"⚠️ Neo4j not available, using fallback service: {e}")
    from services.chat_service_fallback import chat_service_fallback as chat_service

app = FastAPI(
    title="Hybrid Chat API",
    description="API for Vietnam Travel Hybrid RAG System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    query: str

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class ChatResponse(BaseModel):
    answer: str
    matches: List[Dict[str, Any]]
    graph_facts: List[Dict[str, Any]]

class SearchResponse(BaseModel):
    matches: List[Dict[str, Any]]

class GraphResponse(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    message: str

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with API information."""
    return HealthResponse(
        status="ok",
        message="Hybrid Chat API is running"
    )

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="ok",
        message="Service is healthy"
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process a chat query and return answer with context."""
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        result = chat_service.process_query(request.query)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.post("/api/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """Search for similar content using vector similarity."""
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        matches = chat_service.pinecone_query(request.query, top_k=request.top_k)
        formatted_matches = [
            {
                "id": m["id"],
                "score": m.get("score", 0),
                "metadata": m.get("metadata", {})
            }
            for m in matches
        ]
        return SearchResponse(matches=formatted_matches)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching: {str(e)}")

@app.get("/api/graph/byIds", response_model=GraphResponse)
async def get_graph_data(ids: str):
    """Get graph data for visualization by node IDs."""
    try:
        if not ids:
            raise HTTPException(status_code=400, detail="Node IDs are required")
        
        node_ids = [id.strip() for id in ids.split(",") if id.strip()]
        if not node_ids:
            raise HTTPException(status_code=400, detail="No valid node IDs provided")
        
        result = chat_service.get_graph_data(node_ids)
        return GraphResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching graph data: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown."""
    chat_service.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

