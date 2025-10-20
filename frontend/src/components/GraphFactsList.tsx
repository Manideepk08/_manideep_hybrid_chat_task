import { GraphFact } from '../types'
import { ArrowRight, Tag } from 'lucide-react'

interface GraphFactsListProps {
  facts: GraphFact[]
  onAddToGraph?: (nodeId: string) => void
  selectedForGraph?: string[]
}

export default function GraphFactsList({ facts, onAddToGraph, selectedForGraph = [] }: GraphFactsListProps) {
  if (facts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No graph relationships found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Graph Relationships ({facts.length})
      </h3>
      {facts.map((fact, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {fact.source}
                </span>
                <ArrowRight size={12} className="text-gray-400" />
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {fact.target_id}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Tag size={12} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {fact.rel}
                </span>
              </div>
              
              <div className="text-sm text-gray-900 font-medium mb-1">
                {fact.target_name}
              </div>
              
              {fact.target_desc && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {fact.target_desc}
                </p>
              )}
              
              {fact.labels && fact.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {fact.labels.map((label, labelIndex) => (
                    <span
                      key={labelIndex}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {onAddToGraph && (
              <button
                onClick={() => onAddToGraph(fact.target_id)}
                disabled={selectedForGraph.includes(fact.target_id)}
                className={`ml-4 px-3 py-1 text-xs rounded transition-colors ${
                  selectedForGraph.includes(fact.target_id)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {selectedForGraph.includes(fact.target_id) ? 'Added' : 'Add to Graph'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

