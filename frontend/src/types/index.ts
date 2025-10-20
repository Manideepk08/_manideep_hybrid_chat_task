export interface ChatMatch {
  id: string
  score: number
  metadata: {
    name?: string
    type?: string
    city?: string
    description?: string
  }
}

export interface GraphFact {
  source: string
  rel: string
  target_id: string
  target_name: string
  target_desc: string
  labels: string[]
}

export interface ChatResponse {
  answer: string
  matches: ChatMatch[]
  graph_facts: GraphFact[]
}

export interface SearchResponse {
  matches: ChatMatch[]
}

export interface GraphNode {
  id: string
  label: string
  group?: string
  title?: string
}

export interface GraphEdge {
  from: string
  to: string
  label?: string
  arrows?: string
}

export interface GraphResponse {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  matches?: ChatMatch[]
  graph_facts?: GraphFact[]
}

