import { ChatMatch } from '../types'
import { MapPin, Star } from 'lucide-react'

interface MatchListProps {
  matches: ChatMatch[]
  onAddToGraph?: (matchId: string) => void
  selectedForGraph?: string[]
}

export default function MatchList({ matches, onAddToGraph, selectedForGraph = [] }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No matches found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Related Results ({matches.length})
      </h3>
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-gray-900">
                  {match.metadata.name || match.id}
                </h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {match.metadata.type}
                </span>
              </div>
              
              {match.metadata.city && (
                <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                  <MapPin size={12} />
                  <span>{match.metadata.city}</span>
                </div>
              )}
              
              {match.metadata.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {match.metadata.description}
                </p>
              )}
              
              <div className="flex items-center space-x-1 mt-2">
                <Star size={12} className="text-yellow-400" />
                <span className="text-xs text-gray-500">
                  Score: {(match.score * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">ID: {match.id}</span>
              </div>
            </div>
            
            {onAddToGraph && (
              <button
                onClick={() => onAddToGraph(match.id)}
                disabled={selectedForGraph.includes(match.id)}
                className={`ml-4 px-3 py-1 text-xs rounded transition-colors ${
                  selectedForGraph.includes(match.id)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {selectedForGraph.includes(match.id) ? 'Added' : 'Add to Graph'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

