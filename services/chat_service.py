# services/chat_service.py
import json
from typing import List, Dict, Any
from openai import OpenAI
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
from neo4j import GraphDatabase
import config

try:
    import google.generativeai as genai
except Exception:
    genai = None

# -----------------------------
# Config
# -----------------------------
EMBED_MODEL = "BAAI/bge-m3"
CHAT_PROVIDER = getattr(config, "CHAT_PROVIDER", "openai").lower()
CHAT_MODEL = (
    "gpt-4o-mini" if CHAT_PROVIDER == "openai" else "gemini-2.5-flash"
)
TOP_K = 5
INDEX_NAME = config.PINECONE_INDEX_NAME

class ChatService:
    def __init__(self):
        self.client = None
        self.embedder = SentenceTransformer(EMBED_MODEL)
        
        # Configure Google Gemini client (preferred)
        if CHAT_PROVIDER == "google":
            if not genai:
                raise ImportError("google-generativeai is not installed. Please install it from requirements.txt")
            if not getattr(config, "GOOGLE_API_KEY", None):
                raise ValueError("GOOGLE_API_KEY is not set in config.py but CHAT_PROVIDER is 'google'.")
            genai.configure(api_key=config.GOOGLE_API_KEY)
        else:
            # Fallback to OpenAI if explicitly requested
            self.client = OpenAI(api_key=config.OPENAI_API_KEY)

        self.pc = Pinecone(api_key=config.PINECONE_API_KEY)
        
        # Connect to Pinecone index
        if INDEX_NAME not in self.pc.list_indexes().names():
            print(f"Creating managed index: {INDEX_NAME}")
            self.pc.create_index(
                name=INDEX_NAME,
                dimension=config.PINECONE_VECTOR_DIM,
                metric="cosine",
                spec=ServerlessSpec(cloud=getattr(config, "PINECONE_CLOUD", "gcp"), region=getattr(config, "PINECONE_ENV", "us-east1"))
            )

        self.index = self.pc.Index(INDEX_NAME)

        # Connect to Neo4j
        self.driver = GraphDatabase.driver(
            config.NEO4J_URI, auth=(config.NEO4J_USER, config.NEO4J_PASSWORD)
        )

    def embed_text(self, text: str) -> List[float]:
        """Get embedding for a text string using BGE-M3."""
        vec = self.embedder.encode([text], normalize_embeddings=True)[0]
        return vec.tolist() if hasattr(vec, "tolist") else list(vec)

    def pinecone_query(self, query_text: str, top_k=TOP_K):
        """Query Pinecone index using embedding."""
        vec = self.embed_text(query_text)
        res = self.index.query(
            vector=vec,
            top_k=top_k,
            include_metadata=True,
            include_values=False
        )
        return res["matches"]

    def fetch_graph_context(self, node_ids: List[str], neighborhood_depth=1):
        """Fetch neighboring nodes from Neo4j."""
        facts = []
        with self.driver.session() as session:
            for nid in node_ids:
                q = (
                    "MATCH (n:Entity {id:$nid})-[r]-(m:Entity) "
                    "RETURN type(r) AS rel, labels(m) AS labels, m.id AS id, "
                    "m.name AS name, m.type AS type, m.description AS description "
                    "LIMIT 10"
                )
                recs = session.run(q, nid=nid)
                for r in recs:
                    facts.append({
                        "source": nid,
                        "rel": r["rel"],
                        "target_id": r["id"],
                        "target_name": r["name"],
                        "target_desc": (r["description"] or "")[:400],
                        "labels": r["labels"]
                    })
        return facts

    def build_prompt(self, user_query, pinecone_matches, graph_facts):
        """Build a chat prompt combining vector DB matches and graph facts."""
        system = (
            "You are a helpful travel assistant. Use the provided semantic search results "
            "and graph facts to answer the user's query briefly and concisely. "
            "Cite node ids when referencing specific places or attractions."
        )

        vec_context = []
        for m in pinecone_matches:
            meta = m["metadata"]
            score = m.get("score", None)
            snippet = f"- id: {m['id']}, name: {meta.get('name','')}, type: {meta.get('type','')}, score: {score}"
            if meta.get("city"):
                snippet += f", city: {meta.get('city')}"
            vec_context.append(snippet)

        graph_context = [
            f"- ({f['source']}) -[{f['rel']}]-> ({f['target_id']}) {f['target_name']}: {f['target_desc']}"
            for f in graph_facts
        ]

        prompt = [
            {"role": "system", "content": system},
            {"role": "user", "content":
             f"User query: {user_query}\n\n"
             "Top semantic matches (from vector DB):\n" + "\n".join(vec_context[:10]) + "\n\n"
             "Graph facts (neighboring relations):\n" + "\n".join(graph_context[:20]) + "\n\n"
             "Based on the above, answer the user's question. If helpful, suggest 2–3 concrete itinerary steps or tips and mention node ids for references."}
        ]
        return prompt

    def call_chat(self, prompt_messages):
        """Call the selected chat provider (Google Gemini or OpenAI)."""
        # Google Gemini path (preferred)
        if CHAT_PROVIDER == "google":
            model = genai.GenerativeModel(CHAT_MODEL)
            # Convert messages into a single text prompt; keep roles for clarity
            joined = []
            for m in prompt_messages:
                role = m.get("role", "user")
                content = m.get("content", "")
                joined.append(f"{role.upper()}: {content}")
            prompt_text = "\n\n".join(joined)
            resp = model.generate_content(prompt_text)
            return getattr(resp, "text", "") or getattr(resp, "candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        
        # OpenAI fallback
        resp = self.client.chat.completions.create(
            model=CHAT_MODEL,
            messages=prompt_messages,
            max_tokens=600,
            temperature=0.2
        )
        return resp.choices[0].message.content

    def process_query(self, query: str) -> Dict[str, Any]:
        """Process a user query and return structured response."""
        matches = self.pinecone_query(query, top_k=TOP_K)
        match_ids = [m["id"] for m in matches]
        graph_facts = self.fetch_graph_context(match_ids)
        prompt = self.build_prompt(query, matches, graph_facts)
        answer = self.call_chat(prompt)
        
        return {
            "answer": answer,
            "matches": [
                {
                    "id": m["id"],
                    "score": m.get("score", 0),
                    "metadata": m.get("metadata", {})
                }
                for m in matches
            ],
            "graph_facts": graph_facts
        }

    def get_graph_data(self, node_ids: List[str]) -> Dict[str, Any]:
        """Get graph data for visualization."""
        nodes = []
        edges = []
        
        with self.driver.session() as session:
            # Get nodes
            for nid in node_ids:
                q = "MATCH (n:Entity {id:$nid}) RETURN n.id AS id, n.name AS name, n.type AS type, labels(n) AS labels"
                recs = session.run(q, nid=nid)
                for r in recs:
                    nodes.append({
                        "id": r["id"],
                        "label": r["name"],
                        "group": r["type"],
                        "title": f"{r['name']} ({', '.join(r['labels'])})"
                    })
            
            # Get edges
            for nid in node_ids:
                q = (
                    "MATCH (n:Entity {id:$nid})-[r]-(m:Entity) "
                    "WHERE m.id IN $node_ids "
                    "RETURN n.id AS from, m.id AS to, type(r) AS label"
                )
                recs = session.run(q, nid=nid, node_ids=node_ids)
                for r in recs:
                    edges.append({
                        "from": r["from"],
                        "to": r["to"],
                        "label": r["label"],
                        "arrows": "to"
                    })
        
        return {"nodes": nodes, "edges": edges}

    def close(self):
        """Close database connections."""
        if hasattr(self, 'driver'):
            self.driver.close()

# Global instance
chat_service = ChatService()

