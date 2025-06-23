import React from 'react'
import { ThemeProvider } from 'styled-components'
import Graph from './graph'

// Import types from the main page component
interface RecursionNode {
  id: string
  params: any[]
  returnValue?: any
  state: 'initial' | 'active' | 'completed' | 'repeated'
  depth: number
  children: RecursionNode[]
  parent?: string
  x?: number
  y?: number
}

interface ExecutionStep {
  nodeId: string
  action: 'call' | 'return'
  params?: any[]
  returnValue?: any
  callStack: string[]
}

// Professional theme matching the winning repository
const theme = {
  colors: {
    primary: '#FFFFFF',
    foreground: '#000000', 
    contrast: '#FFFFFF',
    background: '#000000'
  }
}

interface Props {
  recursionTree: RecursionNode | null
  executionSteps: ExecutionStep[]
  currentStep: number
  isDarkMode?: boolean
}

export const ProfessionalGraph: React.FC<Props> = ({
  recursionTree,
  executionSteps,
  currentStep,
  isDarkMode = false
}) => {
  // Convert recursion tree to professional graph format
  const { vertices, edges, bottomRight } = React.useMemo(() => {
    if (!recursionTree) return { vertices: {}, edges: {}, bottomRight: [800, 600] as [number, number] }

    const vertices: Record<string, any> = {}
    const edges: Record<string, any> = {}
    let maxX = 0, maxY = 0

    // Convert recursion nodes to vertices
    const processNode = (node: RecursionNode, visitTime: number): number => {
      if (!node.x || !node.y) return visitTime

      // Get node creation and completion times
      const creationStep = executionSteps.findIndex(step => step.nodeId === node.id && step.action === 'call')
      const completionStep = executionSteps.findIndex(step => step.nodeId === node.id && step.action === 'return')
      
      const nodeLabel = node.params.length >= 2 
        ? `${node.params[0]},${node.params[1]}`  // For Hanoi: (n,rod)
        : `${node.params[0]}`  // For factorial/fibonacci: (n)

      vertices[node.id] = {
        coord: [node.x, node.y] as [number, number],
        label: nodeLabel,
        times: [creationStep >= 0 ? creationStep : 0],
        memoized: false
      }

      maxX = Math.max(maxX, node.x + 100)
      maxY = Math.max(maxY, node.y + 100)

      // Process children and create edges
      node.children.forEach((child: RecursionNode, index: number) => {
        if (child.x && child.y) {
          const childCreationStep = executionSteps.findIndex(step => step.nodeId === child.id && step.action === 'call')
          const childReturnStep = executionSteps.findIndex(step => step.nodeId === child.id && step.action === 'return')
          
          const edgeKey = JSON.stringify([node.id, child.id])
          
          // Create edge without value initially (call edge)
          edges[edgeKey] = {
            label: '',
            timeRange: [
              childCreationStep >= 0 ? childCreationStep : executionSteps.length,
              childReturnStep >= 0 ? childReturnStep : executionSteps.length
            ],
            offset: 0, // No offset for call edges
            fromCenter: true
          }

          // Replace with return value when function returns (return edge with offset)
          if (childReturnStep >= 0) {
            const returnEdgeKey = JSON.stringify([child.id, node.id])
            edges[returnEdgeKey] = {
              label: child.returnValue !== undefined ? `${child.returnValue}` : '',
              timeRange: [childReturnStep, executionSteps.length],
              offset: 0, // No offset - we'll use segmented lines instead
              fromCenter: false
            }
          }
          
          visitTime = processNode(child, visitTime + 1)
        }
      })

      return visitTime
    }

    processNode(recursionTree, 0)

    return {
      vertices,
      edges, 
      bottomRight: [Math.max(maxX, 800), Math.max(maxY, 600)] as [number, number]
    }
  }, [recursionTree, executionSteps])

  // Adjust theme for dark mode
  const currentTheme = React.useMemo(() => ({
    ...theme,
    colors: {
      ...theme.colors,
      foreground: '#000000',
      contrast: '#FFFFFF',
      background: '#000000'
    }
  }), [isDarkMode])

  if (!recursionTree) return null

  return (
    <ThemeProvider theme={currentTheme}>
      <div style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: currentTheme.colors.background,
        borderRadius: '8px'
      }}>
        <Graph
          time={currentStep}
          vertices={vertices}
          edges={edges}
          bottomRight={bottomRight}
        />
      </div>
    </ThemeProvider>
  )
}

export default ProfessionalGraph 