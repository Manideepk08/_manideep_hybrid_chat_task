import { useEffect, useRef } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'
import { GraphNode, GraphEdge } from '../types'

// Type definitions for vis-network
interface VisNode {
  id: string
  label: string
  group?: string
  title?: string
}

interface VisEdge {
  id?: string
  from: string
  to: string
  label?: string
  arrows?: string
}

// Define the Options type locally since @types/vis-network doesn't exist
interface VisOptions {
  nodes: {
    shape: string
    size: number
    font: {
      size: number
      color: string
    }
    borderWidth: number
    shadow: boolean
  }
  edges: {
    width: number
    color: { inherit: string }
    smooth: {
      enabled: boolean
      type: string
      roundness: number
    }
    arrows: {
      to: { enabled: boolean; scaleFactor: number }
    }
    font: {
      size: number
      color: string
    }
  }
  physics: {
    enabled: boolean
    stabilization: {
      enabled: boolean
      iterations: number
    }
    barnesHut: {
      gravitationalConstant: number
      centralGravity: number
      springLength: number
      springConstant: number
      damping: number
    }
  }
  interaction: {
    hover: boolean
    tooltipDelay: number
    hideEdgesOnDrag: boolean
    hideNodesOnDrag: boolean
  }
  layout: {
    improvedLayout: boolean
  }
}

interface GraphViewProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  height?: string
}

export default function GraphView({ nodes, edges, height = '600px' }: GraphViewProps) {
  const networkRef = useRef<HTMLDivElement>(null)
  const networkInstanceRef = useRef<Network | null>(null)

  useEffect(() => {
    if (!networkRef.current) return

    // Convert to vis-network format
    const visNodes: VisNode[] = nodes.map(node => ({
      id: node.id,
      label: node.label,
      group: node.group,
      title: node.title
    }))

    const visEdges: VisEdge[] = edges.map(edge => ({
      id: `${edge.from}-${edge.to}`,
      from: edge.from,
      to: edge.to,
      label: edge.label,
      arrows: edge.arrows
    }))

    // Create datasets
    const nodesDataset = new DataSet<VisNode>(visNodes)
    const edgesDataset = new DataSet<VisEdge>(visEdges)

    // Network options
    const options: VisOptions = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: {
          size: 12,
          color: '#333',
        },
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        width: 2,
        color: { inherit: 'from' },
        smooth: {
          enabled: true,
          type: 'dynamic',
          roundness: 0.5,
        },
        arrows: {
          to: { enabled: true, scaleFactor: 1 },
        },
        font: {
          size: 10,
          color: '#666',
        },
      },
      physics: {
        enabled: true,
        stabilization: {
          enabled: true,
          iterations: 100,
        },
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.1,
          springLength: 100,
          springConstant: 0.05,
          damping: 0.1,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false,
      },
      layout: {
        improvedLayout: true,
      },
    }

    // Create network
    const data = {
      nodes: nodesDataset,
      edges: edgesDataset,
    }

    const network = new Network(networkRef.current, data, options)
    networkInstanceRef.current = network

    // Fit to screen after stabilization
    network.on('stabilizationEnd' as any, () => {
      network.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad',
        },
      })
    })

    // Cleanup
    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.destroy()
        networkInstanceRef.current = null
      }
    }
  }, [nodes, edges])

  if (nodes.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-gray-500">No graph data to display</p>
          <p className="text-sm text-gray-400">Add nodes from search results to visualize relationships</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Knowledge Graph Visualization
        </h3>
        <p className="text-sm text-gray-600">
          {nodes.length} nodes, {edges.length} relationships
        </p>
      </div>
      <div
        ref={networkRef}
        style={{ height }}
        className="w-full"
      />
    </div>
  )
}

