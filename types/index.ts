export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp'

export type RecursionProblem = 'factorial' | 'fibonacci' | 'hanoi'

export interface CodeExample {
  language: Language
  code: string
  explanation: string
}

export interface CallStackFrame {
  id: string
  functionName: string
  parameters: Record<string, any>
  returnValue?: any
  depth: number
  isActive: boolean
  line?: number
}

export interface RecursionStep {
  id: string
  description: string
  callStack: CallStackFrame[]
  currentLine: number
  variables: Record<string, any>
  explanation: string
}

export interface ProblemConfig {
  id: RecursionProblem
  title: string
  description: string
  complexity: 'Beginner' | 'Intermediate' | 'Advanced'
  concepts: string[]
  codeExamples: Record<Language, CodeExample>
  visualizationSteps: RecursionStep[]
}

export interface VisualizationState {
  currentStep: number
  isPlaying: boolean
  speed: number
  showCallStack: boolean
  showVariables: boolean
}

// Types for the professional graph components

export type Point = [number, number]

export interface VerticeData {
  coord: Point
  label: string
  times: number[]
  memoized: boolean
}

export interface EdgeData {
  label: string
  timeRange: [number, number]
  offset?: number
  fromCenter?: boolean
}

export type VerticesData = Record<string, VerticeData>
export type EdgesData = Record<string, EdgeData>

// Main recursion tree types
export interface RecursionNode {
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

export interface ExecutionStep {
  nodeId: string
  action: 'call' | 'return'
  params?: any[]
  returnValue?: any
  callStack: string[]
}



export interface VisualizationSettings {
  showStepByStep: boolean
  animationSpeed: number
  showCallStack: boolean
  showVariables: boolean
} 