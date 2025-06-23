import React from 'react'

import styled from 'styled-components'
import DirectedEdge from './directed-edge'
import Vertice from './vertice'
import { Point, VerticesData, EdgesData } from '../../types'

type Props = {
  time: number
  bottomRight: Point
  vertices: VerticesData
  edges: EdgesData
}

// renderiza o grafo em um dado momento (time)
const Graph = ({ time, edges, vertices, bottomRight }: Props) => {
  const [transform, setTransform] = React.useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
  const svgRef = React.useRef<SVGSVGElement>(null)

  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!svgRef.current) return
    
    const rect = svgRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Convert mouse position to SVG coordinates
    const svgX = (mouseX / rect.width) * bottomRight[0]
    const svgY = (mouseY / rect.height) * bottomRight[1]
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.1, Math.min(5, transform.scale * zoomFactor))
    
    // Zoom towards mouse position
    const newX = svgX - (svgX - transform.x) * (newScale / transform.scale)
    const newY = svgY - (svgY - transform.y) * (newScale / transform.scale)
    
    setTransform({ x: newX, y: newY, scale: newScale })
  }, [transform, bottomRight])

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y })
    }
  }, [transform])

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      setTransform(prev => ({ ...prev, x: newX, y: newY }))
    }
  }, [isDragging, dragStart])

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      touchAction: 'none'
    }}>
      <Svg 
        ref={svgRef}
        viewBox={`0 0 ${bottomRight[0]} ${bottomRight[1]}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
      <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
      {Object.entries(edges).map(([key, data]) => {
        const [u, v] = JSON.parse(key)
          const edgeData = data as any

        return (
            time >= edgeData.timeRange[0] &&
            time <= edgeData.timeRange[1] &&
          vertices[u]?.coord &&
          vertices[v]?.coord && (
            <DirectedEdge
              key={key}
              start={vertices[u].coord}
              end={vertices[v].coord}
                label={edgeData.label}
                highlight={edgeData.timeRange[0] === time}
                offset={edgeData.offset}
                fromCenter={edgeData.fromCenter}
            />
          )
        )
      })}
      {Object.entries(vertices).map(([key, data]) => {
          const vertexData = data as any
        return (
            time >= vertexData.times[0] && (
            <Vertice
              key={key}
                center={vertexData.coord}
                label={vertexData.label}
              highlight={
                  vertexData.times.some((t: number) => t === time)
                  ? 'current'
                    : vertexData.memoized
                    ? 'memoized'
                    : 'none'
              }
            />
          )
        )
      })}
      </g>
      </Svg>
    </div>
  )
}

export default Graph

const Svg = styled.svg`
  /* flex-basis: 0; */
  flex-grow: 1; /* aumenta o height para o máximo que couber */
  border-radius: 0 0 8px 8px;
  background-color: #000000;
  margin: 0.6em;
  user-select: none;
  touch-action: none; /* Prevent browser zoom on touch devices */
  overflow: hidden; /* Contain the zoom within the SVG */
`
