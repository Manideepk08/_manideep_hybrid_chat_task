import { Database, Brain, Network } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About Hybrid Chat
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Hybrid Chat is a Vietnam travel assistant that combines vector search with knowledge graphs 
            to provide comprehensive and contextual travel recommendations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Database className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Vector Search</h3>
              <p className="text-sm text-gray-600">
                Semantic search using BAAI/bge-m3 embeddings stored in Pinecone
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Network className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Knowledge Graph</h3>
              <p className="text-sm text-gray-600">
                Relationship data stored in Neo4j for contextual connections
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">LLM Integration</h3>
              <p className="text-sm text-gray-600">
                Google Gemini or OpenAI for natural language responses
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 mb-8">
            <li>Your question is converted to a vector embedding using BAAI/bge-m3</li>
            <li>Pinecone finds the most similar travel content (attractions, hotels, activities)</li>
            <li>Neo4j retrieves related entities and relationships from the knowledge graph</li>
            <li>The LLM combines both sources to generate a comprehensive answer</li>
            <li>You can visualize the relationships in the interactive graph view</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h2>
          <p className="text-gray-600 mb-4">
            The system uses the Vietnam travel dataset containing information about:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-8">
            <li><strong>Cities:</strong> Hanoi, Ho Chi Minh City, Da Nang, Hoi An, Hue, Sapa, Ha Long Bay, Nha Trang, Da Lat, Mekong Delta</li>
            <li><strong>Attractions:</strong> Historical sites, natural wonders, cultural landmarks</li>
            <li><strong>Hotels:</strong> Accommodation options across different cities</li>
            <li><strong>Activities:</strong> Tours, experiences, and things to do</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• FastAPI (Python web framework)</li>
                <li>• Pinecone (Vector database)</li>
                <li>• Neo4j (Graph database)</li>
                <li>• OpenAI/Google Gemini (LLM)</li>
                <li>• BAAI/bge-m3 (Embeddings)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React 18 with TypeScript</li>
                <li>• Vite (Build tool)</li>
                <li>• TailwindCSS (Styling)</li>
                <li>• React Query (Data fetching)</li>
                <li>• Vis.js (Graph visualization)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Getting Started</h3>
            <p className="text-gray-600 mb-4">
              To run this system locally, you'll need:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Python 3.11+ with the required dependencies</li>
              <li>Neo4j database (local or Aura)</li>
              <li>Pinecone account and API key</li>
              <li>OpenAI or Google API key</li>
              <li>Node.js 18+ for the frontend</li>
            </ol>
            <p className="text-gray-600 mt-4">
              See the README.md file for detailed setup instructions.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Built as a demonstration of hybrid RAG (Retrieval-Augmented Generation) 
              combining vector search and knowledge graphs for enhanced AI responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

