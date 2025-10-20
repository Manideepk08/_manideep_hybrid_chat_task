import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { chatApi } from '../services/api'
import GraphView from '../components/GraphView'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

export default function GraphPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [nodeIds, setNodeIds] = useState<string[]>([])

  useEffect(() => {
    const idsParam = searchParams.get('ids')
    if (idsParam) {
      setNodeIds(idsParam.split(',').map(id => id.trim()).filter(Boolean))
    }
  }, [searchParams])

  const { data: graphData, isLoading, error } = useQuery({
    queryKey: ['graph', nodeIds],
    queryFn: () => chatApi.getGraphData(nodeIds),
    enabled: nodeIds.length > 0,
  })

  if (nodeIds.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Graph Data
            </h3>
            <p className="text-gray-600 mb-6">
              No node IDs provided. Please select nodes from the chat page to visualize.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <ArrowLeft size={16} />
              <span>Back to Chat</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Chat</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Knowledge Graph
            </h1>
            <p className="text-gray-600">
              Visualizing relationships for {nodeIds.length} selected nodes
            </p>
          </div>
        </div>
      </div>

      {/* Graph Content */}
      {isLoading && (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-primary-600 mr-3" />
            <span className="text-lg text-gray-600">Loading graph data...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="card">
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Graph
            </h3>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'Failed to load graph data'}
            </p>
          </div>
        </div>
      )}

      {graphData && (
        <GraphView
          nodes={graphData.nodes}
          edges={graphData.edges}
          height="700px"
        />
      )}

      {/* Node List */}
      {nodeIds.length > 0 && (
        <div className="mt-6 card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Selected Nodes ({nodeIds.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodeIds.map((id) => (
              <div
                key={id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <code className="text-sm font-mono text-gray-700">{id}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

