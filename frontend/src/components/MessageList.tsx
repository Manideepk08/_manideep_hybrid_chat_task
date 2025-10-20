import { ChatMessage } from '../types'
import ReactMarkdown from 'react-markdown'
import { User, Bot, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface MessageListProps {
  messages: ChatMessage[]
}

export default function MessageList({ messages }: MessageListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Bot size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Welcome to Vietnam Travel Assistant
        </h3>
        <p className="text-gray-600">
          Ask me about destinations, attractions, hotels, or activities in Vietnam!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex space-x-4 ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.type === 'assistant' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
            </div>
          )}
          
          <div
            className={`max-w-3xl ${
              message.type === 'user'
                ? 'bg-primary-600 text-white rounded-lg px-4 py-2'
                : 'bg-white border border-gray-200 rounded-lg p-4'
            }`}
          >
            {message.type === 'user' ? (
              <p className="text-sm">{message.content}</p>
            ) : (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check size={12} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {message.type === 'user' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

