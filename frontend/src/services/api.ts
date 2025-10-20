import axios from 'axios'
import { ChatResponse, SearchResponse, GraphResponse } from '../types'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const chatApi = {
  chat: async (query: string): Promise<ChatResponse> => {
    const response = await api.post('/api/chat', { query })
    return response.data
  },

  search: async (query: string, topK?: number): Promise<SearchResponse> => {
    const response = await api.post('/api/search', { query, top_k: topK })
    return response.data
  },

  getGraphData: async (nodeIds: string[]): Promise<GraphResponse> => {
    const ids = nodeIds.join(',')
    const response = await api.get(`/api/graph/byIds?ids=${ids}`)
    return response.data
  },

  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/api/health')
    return response.data
  },
}

