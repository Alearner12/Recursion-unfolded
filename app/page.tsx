'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, ChevronRight, Edit3, Code2, ChevronLeft, Menu, Sun, Moon } from 'lucide-react'
import { recursionProblems } from '@/data/recursionProblems'
import ProfessionalGraph from '../components/ProfessionalGraph'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

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

interface CallStackFrame {
  functionName: string
  params: any[]
  depth: number
}

interface TreeNodeLayout extends RecursionNode {
  x: number
  y: number
  mod: number      // Modifier for children positioning
  shift: number    // Shift amount to avoid conflicts
  change: number   // Change in shift for this node's level
  ancestor: TreeNodeLayout | null
  thread: TreeNodeLayout | null
  number: number   // Position among siblings
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('factorial')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [inputValue, setInputValue] = useState(5)
  const [error, setError] = useState('')
  const [userCode, setUserCode] = useState('')
  const [isCustomCode, setIsCustomCode] = useState(false)
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([])
  const [recursionTree, setRecursionTree] = useState<RecursionNode | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode

  const algorithms: Record<string, { name: string; description: string; maxDepth: number; maxInput: number }> = {
    factorial: {
      name: 'Factorial',
      description: 'Calculate n! = n × (n-1) × ... × 1',
      maxDepth: 10,
      maxInput: 10 // 10! = 3,628,800 calls
    },
    fibonacci: {
      name: 'Fibonacci',
      description: 'Generate Fibonacci sequence: F(n) = F(n-1) + F(n-2)',
      maxDepth: 8,
      maxInput: 8 // 8th Fibonacci has ~34 calls
    },
    hanoi: {
      name: 'Tower of Hanoi',
      description: 'Move n disks between 3 rods following the rules',
      maxDepth: 6,
      maxInput: 6 // 6 disks = 63 moves
    }
  }

  const languages = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++'
  }

  // Get code examples from the comprehensive data file
  const getCodeExample = (language: string, algorithm: string): string => {
    const problem = recursionProblems[algorithm]
    if (problem && problem.codeExamples && problem.codeExamples[language as keyof typeof problem.codeExamples]) {
      return problem.codeExamples[language as keyof typeof problem.codeExamples].code
    }
    return ''
  }

  useEffect(() => {
    setMounted(true)
    setUserCode(getCodeExample('javascript', 'factorial'))
    
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('recursion-visualizer-dark-mode')
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save dark mode preference to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('recursion-visualizer-dark-mode', JSON.stringify(isDarkMode))
    }
  }, [isDarkMode, mounted])

  useEffect(() => {
    if (!isCustomCode) {
      setUserCode(getCodeExample(selectedLanguage, selectedAlgorithm))
    }
  }, [selectedLanguage, selectedAlgorithm, isCustomCode])

  // Parse and trace function execution with call stack tracking
  const traceExecution = useCallback((code: string, params: any[]) => {
    const steps: ExecutionStep[] = []
    let nodeCounter = 0
    const nodeMap = new Map<string, RecursionNode>()
    let rootNode: RecursionNode | null = null
    const callStackTracker: string[] = []
    const nodeStack: RecursionNode[] = [] // Track active nodes
    const MAX_RECURSIVE_CALLS = 256
    let callCount = 0

    try {
      // Enhanced execution tracer with proper tree building
      const createTracedFunction = (funcName: string) => {
        return (...args: any[]) => {
          callCount++
          if (callCount > MAX_RECURSIVE_CALLS) {
            throw new Error(`Maximum recursive calls (${MAX_RECURSIVE_CALLS}) exceeded. This would create too large a visualization.`)
          }

          const nodeId = `node_${++nodeCounter}`
          const callString = `${funcName}(${args.join(', ')})`
          
          // Add to call stack
          callStackTracker.push(callString)
          
          const node: RecursionNode = {
            id: nodeId,
            params: args,
            state: rootNode ? 'active' : 'initial',
            depth: callStackTracker.length - 1,
            children: [],
            x: 0,
            y: 0
          }
          
          nodeMap.set(nodeId, node)
          
          // Establish parent-child relationship
          if (nodeStack.length > 0) {
            const parentNode = nodeStack[nodeStack.length - 1]
            parentNode.children.push(node)
            node.parent = parentNode.id
          } else {
            rootNode = node
          }
          
          // Add to node stack
          nodeStack.push(node)
          
          steps.push({
            nodeId,
            action: 'call',
            params: args,
            callStack: [...callStackTracker]
          })

          let result: any
          
          // Execute the actual function logic with proper parameter handling
          if (funcName === 'factorial') {
            const n = args[0]
            if (n <= 1) {
              result = 1
            } else {
              result = n * createTracedFunction('factorial')(n - 1)
            }
          } else if (funcName === 'fibonacci') {
            const n = args[0]
            if (n <= 1) {
              result = n
            } else {
              result = createTracedFunction('fibonacci')(n - 1) + createTracedFunction('fibonacci')(n - 2)
            }
          } else if (funcName === 'hanoi') {
            const n = args[0]
            const to = args[1] || 2 // Default destination rod
            
            if (n === 1) {
              result = 1
            } else {
              let moves = 0
              // Create the tree pattern shown in the image
              // Left subtree: move n-1 disks to auxiliary rod 
              const aux1 = to === 2 ? 1 : (to === 1 ? 0 : 2)
              moves += createTracedFunction('hanoi')(n - 1, aux1)
              
              // Move the largest disk (1 move)
              moves += 1
              
              // Right subtree: move n-1 disks to destination rod
              moves += createTracedFunction('hanoi')(n - 1, to)
              
              result = moves
            }
          } else {
            result = 1
          }
          
          node.returnValue = result
          node.state = 'completed'
          
          // Remove from stacks
          nodeStack.pop()
          callStackTracker.pop()
          
          steps.push({
            nodeId,
            action: 'return',
            returnValue: result,
            callStack: [...callStackTracker]
          })
          
          return result
        }
      }

      // Execute the traced function
      const tracedFunction = createTracedFunction(selectedAlgorithm)
      tracedFunction(...params)

      setExecutionSteps(steps)
      setRecursionTree(rootNode)
      setError('')
      
      // Calculate dynamic tree size based on number of calls
      if (rootNode) {
        const treeScale = Math.min(1, Math.max(0.3, 1 - (callCount / MAX_RECURSIVE_CALLS) * 0.7))
        calculateNodePositions(rootNode, 600, 50, 0, 1, treeScale)
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during execution')
      setExecutionSteps([])
      setRecursionTree(null)
    }
  }, [selectedAlgorithm])

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }

    setError('')
    setIsPlaying(true)
    setCurrentStep(0)

    // Validate input
    if (inputValue < 0) {
      setError('Input must be non-negative')
      setIsPlaying(false)
      return
    }
    if (inputValue > 10) {
      setError('Input too large (max 10)')
      setIsPlaying(false)
      return
    }

    // Start tracing execution
    traceExecution(userCode, [inputValue])
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setError('')
    setExecutionSteps([])
    setRecursionTree(null)
  }

  const handleStepForward = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Auto-play animation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < executionSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= executionSteps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 2000) // Slowed down from 1500ms to 2000ms for better live visualization
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, executionSteps.length])

  // Calculate tree depth for auto-zoom
  const getTreeDepth = (node: RecursionNode | null): number => {
    if (!node || node.children.length === 0) return 1
    return 1 + Math.max(...node.children.map(child => getTreeDepth(child)))
  }

  // Calculate tree width for auto-zoom (improved for professional layout)
  const getTreeWidth = (node: RecursionNode | null): number => {
    if (!node) return 1
    if (node.children.length === 0) return 1
    
    // Calculate actual width based on positioned nodes
    const getMinMaxX = (n: RecursionNode): { min: number, max: number } => {
      let min = n.x || 0
      let max = n.x || 0
      
      n.children.forEach(child => {
        const childMinMax = getMinMaxX(child)
        min = Math.min(min, childMinMax.min)
        max = Math.max(max, childMinMax.max)
      })
      
      return { min, max }
    }
    
    // If tree hasn't been positioned yet, estimate width
    if (node.x === undefined) {
      return Math.max(1, node.children.length * 2)
    }
    
    const { min, max } = getMinMaxX(node)
    return Math.max(1, (max - min) / 120) // Updated from 100 to 120 to match new spacing
  }

  // Professional Tree Layout - Simplified but Improved Algorithm
  const professionalTreeLayout = (root: RecursionNode): void => {
    // Pass 1: Calculate initial positions for all nodes
    calculateInitialPositions(root, 0, 0)
    
    // Pass 2: Resolve conflicts between subtrees
    resolveConflicts(root)
    
    // Pass 3: Center parents over children
    centerParents(root)
    
    // Pass 4: Normalize coordinates
    normalizeTreeCoordinates(root)
  }

    // Calculate initial positions based on tree structure
  const calculateInitialPositions = (node: RecursionNode, x: number, y: number): void => {
    // For factorial, use horizontal layout (swap x and y logic)
    if (selectedAlgorithm === 'factorial') {
    node.x = x
    node.y = y
      node.depth = Math.floor(x / 80) // Depth based on x for horizontal layout

      if (node.children.length === 0) {
        // Leaf node - position is already set
        return
      }

      // Position children horizontally to the right
      const baseSpacing = 60
      const childrenHeight = (node.children.length - 1) * baseSpacing
      const startY = y - childrenHeight / 2

    node.children.forEach((child, index) => {
        calculateInitialPositions(child, x + 80, startY + index * baseSpacing) // Move right, spread vertically
      })
    } else if (selectedAlgorithm === 'fibonacci') {
      // For fibonacci, use diagonal tree layout to show branching clearly
      node.x = x
      node.y = y
      node.depth = Math.floor(y / 100) // Increased spacing for better visibility

      if (node.children.length === 0) {
        // Leaf node - position is already set
        return
      }

      // Position children diagonally with wider spacing for fibonacci
      const horizontalSpacing = 120 // Wider horizontal spacing
      const verticalSpacing = 100   // Vertical spacing between levels
      
      if (node.children.length === 1) {
        // Single child (base case or simplified)
        calculateInitialPositions(node.children[0], x, y + verticalSpacing)
      } else if (node.children.length === 2) {
        // Two children (typical fibonacci: fib(n-1) and fib(n-2))
        calculateInitialPositions(node.children[0], x - horizontalSpacing, y + verticalSpacing) // Left child
        calculateInitialPositions(node.children[1], x + horizontalSpacing, y + verticalSpacing) // Right child
      } else {
        // Multiple children - spread them out
        const totalWidth = (node.children.length - 1) * horizontalSpacing
        const startX = x - totalWidth / 2
        
        node.children.forEach((child, index) => {
          calculateInitialPositions(child, startX + index * horizontalSpacing, y + verticalSpacing)
        })
      }
    } else {
      // For hanoi and other algorithms, use vertical layout
      node.x = x
      node.y = y
      node.depth = Math.floor(y / 80)

      if (node.children.length === 0) {
        // Leaf node - position is already set
        return
      }

      // Position children with base spacing
      const baseSpacing = 80 // Increased from 60 for better spacing
      const childrenWidth = (node.children.length - 1) * baseSpacing
      const startX = x - childrenWidth / 2

      node.children.forEach((child, index) => {
        calculateInitialPositions(child, startX + index * baseSpacing, y + 80)
      })
    }
  }

  // Resolve conflicts between subtrees using contour scanning
  const resolveConflicts = (node: RecursionNode): void => {
    if (node.children.length < 2) return

    // Process children first (post-order)
    node.children.forEach(child => resolveConflicts(child))

    // Check conflicts between adjacent siblings
    for (let i = 1; i < node.children.length; i++) {
      const leftSubtree = node.children[i - 1]
      const rightSubtree = node.children[i]
      
      const conflict = findConflict(leftSubtree, rightSubtree)
      if (conflict > 0) {
        // Shift right subtree and all following siblings
        for (let j = i; j < node.children.length; j++) {
          shiftSubtree(node.children[j], conflict)
        }
      }
    }
  }

  // Find the minimum distance needed to separate two subtrees
  const findConflict = (leftTree: RecursionNode, rightTree: RecursionNode): number => {
    if (selectedAlgorithm === 'factorial') {
      // For horizontal layout, check Y-axis conflicts
      const topContour = getBottomContour(leftTree)
      const bottomContour = getTopContour(rightTree)
      
      let maxConflict = 0
      const minLength = Math.min(topContour.length, bottomContour.length)
      
      for (let i = 0; i < minLength; i++) {
        const distance = topContour[i] - bottomContour[i] + 60
        maxConflict = Math.max(maxConflict, distance)
      }
      
      return maxConflict
    } else if (selectedAlgorithm === 'fibonacci') {
      // For fibonacci diagonal layout, use wider spacing
      const leftContour = getRightContour(leftTree)
      const rightContour = getLeftContour(rightTree)
      
      let maxConflict = 0
      const minLength = Math.min(leftContour.length, rightContour.length)
      
      for (let i = 0; i < minLength; i++) {
        const distance = leftContour[i] - rightContour[i] + 100 // Increased spacing for fibonacci
        maxConflict = Math.max(maxConflict, distance)
      }
      
      return maxConflict
    } else {
      // Original vertical layout logic for hanoi and others
      const leftContour = getRightContour(leftTree)
      const rightContour = getLeftContour(rightTree)
      
      let maxConflict = 0
      const minLength = Math.min(leftContour.length, rightContour.length)
      
      for (let i = 0; i < minLength; i++) {
        const distance = leftContour[i] - rightContour[i] + 80 // Increased from 60
        maxConflict = Math.max(maxConflict, distance)
      }
      
      return maxConflict
    }
  }

  // Get the rightmost x-coordinate at each level
  const getRightContour = (node: RecursionNode): number[] => {
    const contour: number[] = []
    
    const traverse = (n: RecursionNode, depth: number) => {
      if (contour.length <= depth) {
        contour.push(n.x || 0)
      } else {
        contour[depth] = Math.max(contour[depth], n.x || 0)
      }
      
      n.children.forEach(child => traverse(child, depth + 1))
    }
    
    traverse(node, 0)
    return contour
  }

  // Get the leftmost x-coordinate at each level
  const getLeftContour = (node: RecursionNode): number[] => {
    const contour: number[] = []
    
    const traverse = (n: RecursionNode, depth: number) => {
      if (contour.length <= depth) {
        contour.push(n.x || 0)
      } else {
        contour[depth] = Math.min(contour[depth], n.x || 0)
      }
      
      n.children.forEach(child => traverse(child, depth + 1))
    }
    
    traverse(node, 0)
    return contour
  }

  // Get the bottommost y-coordinate at each level (for horizontal layout)
  const getBottomContour = (node: RecursionNode): number[] => {
    const contour: number[] = []
    
    const traverse = (n: RecursionNode, depth: number) => {
      if (contour.length <= depth) {
        contour.push(n.y || 0)
      } else {
        contour[depth] = Math.max(contour[depth], n.y || 0)
      }
      
      n.children.forEach(child => traverse(child, depth + 1))
    }
    
    traverse(node, 0)
    return contour
  }

  // Get the topmost y-coordinate at each level (for horizontal layout)
  const getTopContour = (node: RecursionNode): number[] => {
    const contour: number[] = []
    
    const traverse = (n: RecursionNode, depth: number) => {
      if (contour.length <= depth) {
        contour.push(n.y || 0)
      } else {
        contour[depth] = Math.min(contour[depth], n.y || 0)
      }
      
      n.children.forEach(child => traverse(child, depth + 1))
    }
    
    traverse(node, 0)
    return contour
  }

  // Shift an entire subtree by the given amount
  const shiftSubtree = (node: RecursionNode, amount: number): void => {
    if (selectedAlgorithm === 'factorial') {
      // For horizontal layout, shift vertically (Y-axis)
      if (node.y !== undefined) {
        node.y += amount
      }
    } else {
      // For vertical layout, shift horizontally (X-axis)
      if (node.x !== undefined) {
        node.x += amount
      }
    }
    node.children.forEach(child => shiftSubtree(child, amount))
  }

  // Center parents over their children
  const centerParents = (node: RecursionNode): void => {
    // Process children first (post-order)
    node.children.forEach(child => centerParents(child))
    
    if (node.children.length > 0) {
      if (selectedAlgorithm === 'factorial') {
        // For horizontal layout, center vertically (Y-axis)
        const topmostChild = node.children[0]
        const bottommostChild = node.children[node.children.length - 1]
        const centerY = ((topmostChild.y || 0) + (bottommostChild.y || 0)) / 2
        node.y = centerY
      } else {
        // For vertical layout, center horizontally (X-axis)
        const leftmostChild = node.children[0]
        const rightmostChild = node.children[node.children.length - 1]
        const centerX = ((leftmostChild.x || 0) + (rightmostChild.x || 0)) / 2
        node.x = centerX
      }
    }
  }

  // Normalize coordinates to ensure no negative values
  const normalizeTreeCoordinates = (node: RecursionNode): void => {
    const getMinX = (n: RecursionNode): number => {
      let min = n.x || 0
      n.children.forEach(child => {
        min = Math.min(min, getMinX(child))
      })
      return min
    }
    
    const minX = getMinX(node)
    if (minX < 50) {
      const offset = 50 - minX
      const adjustX = (n: RecursionNode): void => {
        if (n.x !== undefined) n.x += offset
        n.children.forEach(child => adjustX(child))
      }
      adjustX(node)
    }
  }

  // Wrapper function to maintain existing interface
  const calculateNodePositions = (node: RecursionNode, centerX = 400, centerY = 100, level = 0, treeDepth = 1, treeScale = 1): void => {
    // Use professional tree layout algorithm
    professionalTreeLayout(node)
    
    // Apply scaling based on number of recursive calls
    const applyScaling = (n: RecursionNode, scale: number): void => {
      if (n.x !== undefined && n.y !== undefined) {
        n.x *= scale
        n.y *= scale
      }
      n.children.forEach(child => applyScaling(child, scale))
    }
    
    // Apply scaling to the entire tree
    applyScaling(node, treeScale)
    
    // Center the tree in the viewport
    const adjustPositions = (n: RecursionNode, offsetX: number, offsetY: number): void => {
      if (n.x !== undefined && n.y !== undefined) {
        n.x += offsetX
        n.y += offsetY
      }
      n.children.forEach(child => adjustPositions(child, offsetX, offsetY))
    }
    
    // Calculate tree bounds
    const getBounds = (n: RecursionNode): { minX: number, maxX: number, minY: number, maxY: number } => {
      let minX = n.x || 0, maxX = n.x || 0, minY = n.y || 0, maxY = n.y || 0
      n.children.forEach(child => {
        const childBounds = getBounds(child)
        minX = Math.min(minX, childBounds.minX)
        maxX = Math.max(maxX, childBounds.maxX)
        minY = Math.min(minY, childBounds.minY)
        maxY = Math.max(maxY, childBounds.maxY)
      })
      return { minX, maxX, minY, maxY }
    }
    
    const bounds = getBounds(node)
    const treeWidth = bounds.maxX - bounds.minX
    const offsetX = centerX - (bounds.minX + treeWidth / 2)
    const offsetY = centerY - bounds.minY
    
    adjustPositions(node, offsetX, offsetY)
  }

  // Render recursion tree node with proper edges and curved arrows
  const renderNode = (node: RecursionNode, currentStepIndex: number) => {
    if (node.x === undefined || node.y === undefined) return null

    // Determine node state based on current step
    let nodeState = node.state
    const currentStepData = executionSteps[currentStepIndex]
    
    // Update state based on current step for live visualization
    if (currentStepIndex >= 0) {
      // Check if this node has been created yet in the current step
      const nodeCreationStep = executionSteps.findIndex(step => step.nodeId === node.id && step.action === 'call')
      const nodeCompletionStep = executionSteps.findIndex(step => step.nodeId === node.id && step.action === 'return')
      
      if (nodeCreationStep > currentStepIndex) {
        // Node hasn't been created yet - don't render it
        return null
      } else if (nodeCreationStep === currentStepIndex) {
        // Node is being created right now - show as active (blue)
        nodeState = 'active'
      } else if (nodeCompletionStep === currentStepIndex) {
        // Node is returning right now - show as active (blue)
        nodeState = 'active'
      } else if (nodeCompletionStep >= 0 && nodeCompletionStep < currentStepIndex) {
        // Node has completed - show as completed (green)
        nodeState = 'completed'
      } else {
        // Node was created but not yet completed - show as created (black)
        nodeState = 'initial'
      }
    }

    // Professional color mapping for live visualization
    const getNodeColor = (state: string, params: any[]) => {
      switch (state) {
        case 'active':
          return '#8B5CF6' // Purple for currently active/traveling node
        case 'completed':
          return '#10B981' // Green for completed nodes
        case 'initial':
        default:
          return '#1F2937' // Black for newly created nodes
      }
    }

    const getStrokeColor = (state: string) => {
      switch (state) {
        case 'active':
          return '#7C3AED' // Darker purple border for active
        case 'completed':
          return '#059669' // Darker green border for completed
        case 'initial':
        default:
          return '#111827' // Very dark border for created nodes
      }
    }

    const getTextColor = (state: string) => {
      switch (state) {
        case 'active':
          return '#FFFFFF' // White text on blue
        case 'completed':
          return '#FFFFFF' // White text on green
        case 'initial':
        default:
          return '#FFFFFF' // White text on black
      }
    }

    return (
      <g key={node.id}>
        {/* Connection lines to children */}
        {node.children.map((child, childIndex) => {
          let x1, y1, x2, y2
          
          if (selectedAlgorithm === 'factorial') {
            // Horizontal layout: parent connects from right side to child's left side
            x1 = (node.x || 0) + 30   // Right of parent node
            y1 = (node.y || 0)        // Center of parent node
            x2 = (child.x || 0) - 30  // Left of child node
            y2 = (child.y || 0)       // Center of child node
          } else if (selectedAlgorithm === 'fibonacci') {
            // Diagonal layout: parent connects from bottom to child's top with diagonal lines
            x1 = (node.x || 0)        // Center of parent node
            y1 = (node.y || 0) + 35   // Bottom edge of parent node (circle radius = 35)
            x2 = (child.x || 0)       // Center of child node
            y2 = (child.y || 0) - 35  // Top edge of child node
          } else {
            // Vertical layout: parent connects from bottom to child's top
            x1 = (node.x || 0)        // Center of parent node
            y1 = (node.y || 0) + 30   // Bottom of parent node
            x2 = (child.x || 0)       // Center of child node
            y2 = (child.y || 0) - 30  // Top of child node
          }
          
          // Check if child is returning RIGHT NOW in this step
          const childCompletionStep = executionSteps.findIndex(step => step.nodeId === child.id && step.action === 'return')
          const childIsReturningNow = childCompletionStep === currentStepIndex
          const childReturnValue = childIsReturningNow ? child.returnValue : undefined
          
          // Create straight line for better arrow display
          const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2
          
          return (
            <g key={`${node.id}-${child.id}`}>
              {/* Professional connection line with gradient */}
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#edgeGradient)"
                strokeWidth="3"
                className="transition-all duration-300"
              />
              
              {/* Subtle call direction indicator */}
              {currentStepData?.nodeId === node.id && currentStepData.action === 'call' && node.children.indexOf(child) === 0 && (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  markerEnd="url(#callArrow)"
                  className="opacity-60"
                />
              )}
              
              {/* Return value flow (ONLY when child is returning RIGHT NOW) */}
              {childIsReturningNow && childReturnValue !== undefined && (
                <g className="return-flow">
                  {/* Professional return flow line */}
            <line
                    x1={x1 + (x2 - x1) * 0.2}
                    y1={y1 + (y2 - y1) * 0.2}
                    x2={x1 + (x2 - x1) * 0.8}
                    y2={y1 + (y2 - y1) * 0.8}
                    stroke="url(#returnGradient)"
                    strokeWidth="5"
                    strokeDasharray="6,3"
                    markerEnd="url(#returnArrow)"
                    className="animate-pulse drop-shadow-sm"
                  />
                  
                  {/* Professional return value badge */}
                  <g className="return-badge">
                    <circle
                      cx={midX}
                      cy={midY}
                      r="16"
                      fill="#10B981"
                      stroke="#059669"
                      strokeWidth="2"
                      className="drop-shadow-md animate-pulse"
                    />
            <text
                      x={midX}
                      y={midY + 5}
                      textAnchor="middle"
                      fill="white"
              fontSize="12"
              fontWeight="bold"
                      className="font-mono"
            >
                      {childReturnValue}
            </text>
                  </g>
          </g>
        )}

              {/* Active call animation (enhanced) */}
              {currentStepData?.nodeId === node.id && currentStepData.action === 'call' && (
          <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#A855F7"
                  strokeWidth="4"
                  strokeDasharray="8,4"
                  markerEnd="url(#activeArrow)"
                  className="animate-pulse opacity-90"
                />
              )}
            </g>
          )
        })}

        {/* Node circle with clean styling */}
        <circle
          cx={(node.x || 0)}
          cy={(node.y || 0)}
          r="35"
          fill={getNodeColor(nodeState, node.params)}
          stroke={getStrokeColor(nodeState)}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        
        {/* Parameter text inside node */}
        <text
          x={(node.x || 0)}
          y={(node.y || 0) - 5}
          textAnchor="middle"
          fill={getTextColor(nodeState)}
          fontSize="16"
          fontWeight="bold"
          className="font-sans"
        >
          {selectedAlgorithm === 'hanoi' && node.params.length >= 2 
            ? `${node.params[0]},${node.params[1]}` // Show (n,destination) for Hanoi like in the image
            : node.params[0] // Show single parameter for factorial/fibonacci
          }
        </text>
        
        {/* Return value inside node (only when returning or completed) */}
        {(nodeState === 'active' || nodeState === 'completed') && node.returnValue !== undefined && (
            <text
            x={(node.x || 0)}
            y={(node.y || 0) + 12}
              textAnchor="middle"
            fill={getTextColor(nodeState)}
            fontSize="12"
            fontWeight="bold"
            className="font-sans opacity-80"
          >
            → {node.returnValue}
            </text>
        )}
        
        {/* Render children */}
        {node.children.map((child) => renderNode(child, currentStepIndex))}
      </g>
    )
  }

  // Get current function call information
  const getCurrentFunctionCall = () => {
    if (!executionSteps.length || currentStep >= executionSteps.length) return null
    
    const currentStepData = executionSteps[currentStep]
    const currentNode = findNodeById(recursionTree, currentStepData.nodeId)
    
    return {
      step: currentStepData,
      node: currentNode,
      isCall: currentStepData.action === 'call',
      isReturn: currentStepData.action === 'return'
    }
  }

  // Get final return value
  const getFinalReturnValue = () => {
    if (!recursionTree || !executionSteps.length) return null
    
    // Check if we're at the end of execution
    if (currentStep >= executionSteps.length - 1) {
      return recursionTree.returnValue
    }
    
    return null
  }

  // Helper function to find node by ID
  const findNodeById = (node: RecursionNode | null, id: string): RecursionNode | null => {
    if (!node) return null
    if (node.id === id) return node
    
    for (const child of node.children) {
      const found = findNodeById(child, id)
      if (found) return found
    }
    
    return null
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen text-gray-900 relative overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900'
    }`}>
      
      {/* Full Screen Tree Visualization */}
      <div className="absolute inset-0">
        
        {/* Dark Mode Toggle - Top Left */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-4 left-4 z-50 p-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
              : 'bg-white/90 hover:bg-white text-gray-700'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        
        {/* Compact Top Stats Strip */}
        <div className={`absolute top-0 left-0 right-0 backdrop-blur-sm px-6 py-2 z-30 h-12 ${
          isDarkMode ? 'bg-gray-900/90 text-white' : 'bg-black/80 text-white'
        }`}>
          <div className="flex justify-center items-center gap-8 text-xs font-medium">
            <span>Calls: <span className="text-emerald-400 font-bold">{executionSteps.filter(s => s.action === 'call').length}</span></span>
            <span>Depth: <span className="text-violet-400 font-bold">{recursionTree ? getTreeDepth(recursionTree) : 0}</span></span>
            <span>Step: <span className="text-indigo-400 font-bold">{currentStep + 1} / {executionSteps.length || 1}</span></span>
            {recursionTree && (() => {
              const depth = getTreeDepth(recursionTree)
              const width = getTreeWidth(recursionTree)
              const depthZoom = Math.max(1, depth / 6)  // Match new calculation
              const widthZoom = Math.max(1, width / 4)   // Match new calculation
              const zoomFactor = Math.max(depthZoom, widthZoom)
              const finalZoom = Math.min(zoomFactor, 3)  // Match new max limit
              const isZoomedOut = finalZoom > 1.1
              return isZoomedOut && (
                <span>Zoom: <span className="text-amber-400 font-bold">Auto ({Math.round(finalZoom * 100)}%)</span></span>
              )
            })()}
          </div>
        </div>

        {/* Current Function Call Indicator */}
        {(() => {
          const currentCall = getCurrentFunctionCall()
          if (!currentCall || !executionSteps.length) return null
          
          return (
            <div className={`absolute top-14 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl border-2 backdrop-blur-sm ${
              currentCall.isCall
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 border-blue-400 text-blue-100'
                : 'bg-gradient-to-r from-green-900 to-green-800 border-green-400 text-green-100'
            }`}>
              <div className="flex items-center gap-3 text-base font-semibold">
                <div className={`w-4 h-4 rounded-full animate-pulse ${
                  currentCall.isCall ? 'bg-blue-400' : 'bg-green-400'
                }`}></div>
                <div>
                  <div className="text-xs opacity-80 mb-1">
                    {currentCall.isCall ? 'CALLING FUNCTION' : 'RETURNING FROM FUNCTION'}
                  </div>
                  <div className="font-bold text-lg">
                    {selectedAlgorithm}({currentCall.node?.params.join(', ')})
                    {currentCall.isReturn && currentCall.node?.returnValue !== undefined && (
                      <span className="ml-2 text-yellow-300">
                        → {currentCall.node.returnValue}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Call Stack Display */}
                {(() => {
          if (!executionSteps.length || !recursionTree) return null
          
          // Build current call stack based on current step
          const callStack: { functionName: string, params: any[], nodeId: string }[] = []
          
          // Go through steps up to current step to build call stack
          for (let i = 0; i <= currentStep && i < executionSteps.length; i++) {
            const step = executionSteps[i]
            if (step.action === 'call') {
              const node = findNodeById(recursionTree, step.nodeId)
              if (node) {
                callStack.push({
                  functionName: selectedAlgorithm,
                  params: node.params,
                  nodeId: step.nodeId
                })
              }
            } else if (step.action === 'return') {
              // Remove the most recent call that matches this return
              for (let j = callStack.length - 1; j >= 0; j--) {
                if (callStack[j].nodeId === step.nodeId) {
                  callStack.splice(j, 1)
                  break
                }
              }
            }
          }
          
          if (callStack.length === 0) return null
          
          return (
            <div className="absolute top-14 right-6 z-40 max-w-xs">
              <div className={`rounded-xl shadow-2xl border-2 backdrop-blur-sm p-4 ${
                isDarkMode
                  ? 'bg-black/90 border-white/30 text-white'
                  : 'bg-white/95 border-gray-400 text-gray-900'
              }`}>
                <div className={`text-sm font-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  📋 CALL STACK ({callStack.length})
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {callStack.map((call, index) => (
                    <div
                      key={`${call.nodeId}-${index}`}
                      className={`px-3 py-2 rounded-lg text-sm font-mono border ${
                        index === callStack.length - 1
                          ? isDarkMode
                            ? 'bg-blue-600/80 border-blue-400 text-white font-bold'
                            : 'bg-blue-500 border-blue-600 text-white font-bold'
                          : isDarkMode
                            ? 'bg-gray-700/80 border-gray-500 text-white'
                            : 'bg-gray-200 border-gray-400 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          index === callStack.length - 1 
                            ? 'text-yellow-300' 
                            : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          #{callStack.length - index}
                        </span>
                        <span className="font-bold">
                          {call.functionName}({call.params.join(', ')})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
                })()}

        {/* Final Return Value Display */}
        {(() => {
          const finalValue = getFinalReturnValue()
          if (finalValue === null) return null
          
          return (
            <div className={`absolute top-14 right-6 z-40 px-6 py-3 rounded-xl shadow-2xl border-2 backdrop-blur-sm ${
              isDarkMode
                ? 'bg-gradient-to-r from-emerald-900 to-teal-900 border-emerald-500/50 text-emerald-100'
                : 'bg-gradient-to-r from-emerald-900 to-teal-900 border-emerald-500/50 text-emerald-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <div className="text-xs font-medium opacity-80">Final Result</div>
                  <div className="font-bold text-lg">
                    {selectedAlgorithm}({inputValue}) = <span className="text-emerald-300">{finalValue}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Professional Tree Visualization Area */}
        <div className="absolute inset-0 pt-12 pb-16 overflow-hidden">
          <div className={`w-full h-full ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            {recursionTree ? (
              (() => {
                // Ensure tree is positioned for professional graph
                const treeDepth = getTreeDepth(recursionTree)
                calculateNodePositions(recursionTree, 600, 50, 0, treeDepth)
                
                return (
                  <ProfessionalGraph
                    recursionTree={recursionTree}
                    executionSteps={executionSteps}
                    currentStep={currentStep}
                    isDarkMode={isDarkMode}
                  />
                )
              })()
            ) : (
              <div className="text-center z-10 relative">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                  <span className="text-white text-3xl font-bold">f(n)</span>
                </div>
                <p className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}>Recursion Tree Visualizer</p>
                <p className={`text-lg mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Follow these steps to see the recursion tree:</p>
                <div className={`rounded-xl p-6 shadow-lg border-2 max-w-md mx-auto ${
                  isDarkMode
                    ? 'bg-gray-800/90 backdrop-blur-sm border-gray-600'
                    : 'bg-white/90 backdrop-blur-sm border-indigo-200'
                }`}>
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold ${
                        isDarkMode ? 'bg-gray-600' : 'bg-indigo-500'
                      }`}>1</div>
                      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Open the control panel (click the menu button on the left)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold ${
                        isDarkMode ? 'bg-gray-600' : 'bg-indigo-500'
                      }`}>2</div>
                      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Choose an algorithm (Factorial, Fibonacci, etc.)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold ${
                        isDarkMode ? 'bg-gray-600' : 'bg-indigo-500'
                      }`}>3</div>
                      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Set input value (try 4 for factorial)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">▶</div>
                      <span className={`font-semibold ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Click "RUN VISUALIZATION" to see the tree!</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Demo Button */}
                  <button
                    onClick={() => {
                    setInputValue(5)
                    setSelectedAlgorithm('fibonacci')
                      setTimeout(() => handlePlay(), 100)
                    }}
                  disabled={isPlaying}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-600'
                      : 'bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-300'
                  } disabled:cursor-not-allowed`}
                >
                  Quick Demo: Fibonacci(5)
                  </button>
              </div>
            )}
          </div>
        </div>

        {/* Compact Bottom Control Bar */}
        <div className={`absolute bottom-0 left-0 right-0 backdrop-blur-sm p-3 z-30 h-16 ${
          isDarkMode ? 'bg-gray-900/90' : 'bg-black/90'
        }`}>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleStepBackward}
              disabled={currentStep === 0}
              className={`p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
              }`}
            >
              ⏮
            </button>
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
              }`}
            >
              ⏪
            </button>
            <button
              onClick={handlePlay}
              className={`p-3 rounded-lg font-medium transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 mx-4 ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={handleStepForward}
              disabled={currentStep >= executionSteps.length - 1}
              className={`p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
              }`}
            >
              ⏩
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(executionSteps.length - 1, currentStep + 1))}
              disabled={currentStep >= executionSteps.length - 1}
              className={`p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
              }`}
            >
              ⏭
            </button>
            <button
              onClick={handleReset}
              className={`p-2 rounded-lg transition-all duration-200 text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              🔄
            </button>
                </div>
                </div>
        </div>
        
      {/* Error Display */}
      {error && (
        <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-40 p-4 rounded-lg shadow-xl border ${
          isDarkMode
            ? 'bg-red-900/50 backdrop-blur-sm border-red-500/50'
            : 'bg-red-900/50 backdrop-blur-sm border-red-500/50'
        }`}>
          <div className="text-red-200 text-sm font-medium">⚠️ {error}</div>
          </div>
        )}

      {/* Control Panel */}
      <div className={`absolute top-0 left-0 h-full w-80 sm:w-96 transform transition-transform duration-300 ease-in-out z-40 ${
        isPanelOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className={`h-full p-4 sm:p-6 shadow-2xl border-r overflow-y-auto ${
          isDarkMode
            ? 'bg-gray-900/95 backdrop-blur-lg border-gray-700'
            : 'bg-white/95 backdrop-blur-lg border-gray-200'
        }`}>
          
                    {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className={`text-lg sm:text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Recursion Visualizer
            </h1>
              <button
              onClick={() => setIsPanelOpen(false)}
              title="Close control panel"
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

          {/* Language Selection */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <h2 className={`text-sm sm:text-base font-semibold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Programming Language</h2>
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                title="Select programming language"
                className={`w-full p-3 rounded-lg border appearance-none cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                }`}
              >
                {Object.entries(languages).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronRight className={`w-4 h-4 rotate-90 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </div>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <h2 className={`text-sm sm:text-base font-semibold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Algorithm</h2>
            <div className="relative">
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                title="Select algorithm"
                className={`w-full p-3 rounded-lg border appearance-none cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                {Object.entries(algorithms).map(([key, algo]) => (
                  <option key={key} value={key}>
                    {algo.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronRight className={`w-4 h-4 rotate-90 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </div>
            </div>
          </div>

          {/* Input Configuration */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <h2 className={`text-sm sm:text-base font-semibold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Input Value</h2>
                        <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 1)}
              min="1"
              max={algorithms[selectedAlgorithm]?.maxInput || 10}
              title={`Enter a value between 1 and ${algorithms[selectedAlgorithm]?.maxInput || 10}`}
              className={`w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Code Display */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-sm sm:text-base font-semibold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Code ({languages[selectedLanguage as keyof typeof languages]})</h2>
          <button
                onClick={() => setIsCustomCode(!isCustomCode)}
                title={isCustomCode ? "Show template code" : "Enable custom code editing"}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Edit3 className="w-4 h-4" />
          </button>
            </div>
            
            {isCustomCode ? (
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={8}
                className={`w-full p-3 rounded-lg border font-mono text-sm transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Enter your recursive function code..."
              />
            ) : (
              <div className={`rounded-lg border overflow-hidden ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <SyntaxHighlighter
                  language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                  style={isDarkMode ? vscDarkPlus : vs}
                  customStyle={{
                    margin: 0,
                    fontSize: '12px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  {userCode}
                </SyntaxHighlighter>
            </div>
          )}

            {/* Code Explanation */}
            {(() => {
              const problem = recursionProblems[selectedAlgorithm]
              const codeExample = problem?.codeExamples?.[selectedLanguage as keyof typeof problem.codeExamples]
              if (codeExample?.explanation && !isCustomCode) {
                return (
                  <div className={`p-3 rounded-lg text-sm ${
                    isDarkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-50 text-blue-800'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">💡</span>
                      <span>{codeExample.explanation}</span>
              </div>
              </div>
                )
              }
              return null
            })()}
            </div>

          {/* Execution Stats */}
          <div className="space-y-3">
            <h2 className={`text-sm sm:text-base font-semibold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Execution Stats</h2>
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Steps:</span>
                  <div className="font-semibold text-blue-500">{executionSteps.length}</div>
          </div>
                <div>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Function Calls:</span>
                  <div className="font-semibold text-green-500">{executionSteps.filter(s => s.action === 'call').length}</div>
              </div>
                <div>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Tree Depth:</span>
                  <div className="font-semibold text-purple-500">{recursionTree ? getTreeDepth(recursionTree) : 0}</div>
              </div>
                <div>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Tree Width:</span>
                  <div className="font-semibold text-orange-500">{recursionTree ? getTreeWidth(recursionTree) : 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Toggle Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`absolute top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 transition-all duration-300 shadow-lg hover:shadow-xl ${
          isPanelOpen ? 'left-80 sm:left-96' : 'left-0'
        } ${
          isDarkMode
            ? 'bg-gradient-to-r from-gray-800/90 to-gray-700/90 hover:from-gray-700 hover:to-gray-600 text-white'
            : 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm hover:from-indigo-700 hover:to-purple-700 text-white'
        }`}
        style={{ 
          borderTopRightRadius: isPanelOpen ? '0.75rem' : '0',
          borderBottomRightRadius: isPanelOpen ? '0.75rem' : '0',
          borderTopLeftRadius: isPanelOpen ? '0' : '0.75rem',
          borderBottomLeftRadius: isPanelOpen ? '0' : '0.75rem'
        }}
      >
        {isPanelOpen ? <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>
    </div>
  )
} 