# config_example.py — copy to config.py and fill with real values.
# Option 1: Local Neo4j (uncomment to use)
#NEO4J_URI = "bolt://localhost:7687"
#NEO4J_DATABASE = "neo4j"
#NEO4J_USER = "neo4j"
#NEO4J_PASSWORD = "password"

# Option 2: Neo4j Aura Cloud (comment out if using local)
NEO4J_URI = "neo4j+ssc://7b94e15a.databases.neo4j.io:7687"
NEO4J_DATABASE = "neo4j"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "a7LtUEx2fxXPUIZTrOwebbpH5vhVTg6aGNQWzHvfAcM"

OPENAI_API_KEY = "sk-proj-......" # your OpenAI API key
GOOGLE_API_KEY = "AIzaSyAaP0Qr9dPN6jrsFK1ToN1JS6GR-X6NYLI"  # optional: your Google Generative AI API key

# Choose which chat provider to use: "openai" or "google"
CHAT_PROVIDER = "google"

PINECONE_API_KEY = "pcsk_2Mw7x5_Fyfzh8DGg9Gwa8Cs3yyuwz6GFyTEdJpywr7jnqYfMn8GiALTm4wJuEV7PbnD8CV" # your Pinecone API key
# Pinecone serverless config
# Free plans commonly allow AWS regions like "us-east-1" or "us-west-2".
PINECONE_CLOUD = "aws"
PINECONE_ENV = "us-east-1"
PINECONE_INDEX_NAME = "vietnam-travel"
PINECONE_VECTOR_DIM = 1024       # BGE-M3 default dense embedding dimension
