import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { chatApi } from '../services/api'
import { ChatMessage } from '../types'
import ChatInput from '../components/ChatInput'
import MessageList from '../components/MessageList'
import MatchList from '../components/MatchList'
import GraphFactsList from '../components/GraphFactsList'
import { Loader2, Network } from 'lucide-react'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedForGraph, setSelectedForGraph] = useState<string[]>([])
  const navigate = useNavigate()

  const chatMutation = useMutation({
    mutationFn: chatApi.chat,
    onSuccess: (data, variables) => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: variables,
        timestamp: new Date(),
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        matches: data.matches,
        graph_facts: data.graph_facts,
      }

      setMessages(prev => [...prev, userMessage, assistantMessage])
    },
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  const handleSendMessage = (message: string) => {
    chatMutation.mutate(message)
  }

  const handleAddToGraph = (nodeId: string) => {
    setSelectedForGraph(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }

  const handleViewGraph = () => {
    if (selectedForGraph.length > 0) {
      const ids = selectedForGraph.join(',')
      navigate(`/graph?ids=${ids}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <MessageList messages={messages} />
          </div>
          
          <div className="card">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={chatMutation.isPending}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Graph Actions */}
          {selectedForGraph.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Graph Selection
                </h3>
                <button
                  onClick={handleViewGraph}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Network size={16} />
                  <span>View Graph ({selectedForGraph.length})</span>
                </button>
              </div>
              <div className="space-y-2">
                {selectedForGraph.map(id => (
                  <div key={id} className="text-sm bg-gray-100 px-3 py-2 rounded">
                    {id}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {chatMutation.isPending && (
            <div className="card">
              <div className="flex items-center space-x-3">
                <Loader2 size={20} className="animate-spin text-primary-600" />
                <span className="text-gray-600">Processing your query...</span>
              </div>
            </div>
          )}

          {/* Matches */}
          {messages.length > 0 && messages[messages.length - 1].matches && (
            <div className="card">
              <MatchList
                matches={messages[messages.length - 1].matches!}
                onAddToGraph={handleAddToGraph}
                selectedForGraph={selectedForGraph}
              />
            </div>
          )}

          {/* Graph Facts */}
          {messages.length > 0 && messages[messages.length - 1].graph_facts && (
            <div className="card">
              <GraphFactsList
                facts={messages[messages.length - 1].graph_facts!}
                onAddToGraph={handleAddToGraph}
                selectedForGraph={selectedForGraph}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

