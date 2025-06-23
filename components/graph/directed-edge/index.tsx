import React from 'react'
import { Container, Line, Text } from './styles'
import { pointOnLine, centralPoint } from './utils'
import { VERTICE_RADIUS } from '../vertice'
import { Point } from '../../../types'

type Props = {
  start: Point
  end: Point
  label?: string
  highlight?: boolean
  offset?: number
  fromCenter?: boolean
}

const DirectedEdge = ({ start, end, label, highlight = false, offset = 0, fromCenter = false }: Props) => {
  const P_start = fromCenter ? start : pointOnLine(end, start, VERTICE_RADIUS)
  const Q_end = pointOnLine(start, end, VERTICE_RADIUS + 2)
  const C_center = centralPoint(P_start, Q_end)

  // Apply a single, unified offset to all points
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const length = Math.sqrt(dx * dx + dy * dy)
  let unitPerpX = 0
  let unitPerpY = 0
  if (length > 0) {
    unitPerpX = -dy / length
    unitPerpY = dx / length
  }
  const offsetX = unitPerpX * offset
  const offsetY = unitPerpY * offset
  
  const P: Point = [P_start[0] + offsetX, P_start[1] + offsetY]
  const Q: Point = [Q_end[0] + offsetX, Q_end[1] + offsetY]
  const C: Point = [C_center[0] + offsetX, C_center[1] + offsetY]

  const animateRef1 = React.useRef<SVGAnimateElement>(null)
  const animateRef2 = React.useRef<SVGAnimateElement>(null)

  // FIXME: gambiarra fudida
  React.useEffect(() => {
    if (animateRef1.current === null || animateRef2.current === null) return

    // reinicia a SMIL animation

    // @ts-ignore
    animateRef1.current.beginElement()
    // @ts-ignore
    animateRef2.current.beginElement()
  }, [start, end])

  // If there's a label, render segmented line, otherwise render normal line
  const hasLabel = label && label.trim() !== ''
  const isReturningArrow = hasLabel && !fromCenter // Returning arrows have labels and fromCenter: false

  return (
    <Container highlight={highlight}>
      <defs>
        <marker
          id={`arrowhead-${start}${end}`}
          markerWidth='6'
          markerHeight='4'
          refX='5'
          refY='2'
          orient='auto'
          markerUnits='strokeWidth'
        >
          <path d='M 2,0 L 2,4 L 6,2 Z' fill='#FFFFFF' />
        </marker>
      </defs>

      {isReturningArrow ? (
        // Render segmented line with gap for label using percentages of total length (for returning arrows only)
        <>
          {/* Calculate total line length and segment points */}
          {(() => {
            const totalLength = Math.sqrt((Q[0] - P[0]) ** 2 + (Q[1] - P[1]) ** 2)
            const firstSegmentLength = totalLength * 0.3 // 30% of total length
            const gapLength = totalLength * 0.4 // 40% of total length for gap
            const secondSegmentStart = firstSegmentLength + gapLength // Start at 70%
            
            // Calculate direction unit vector
            const unitX = (Q[0] - P[0]) / totalLength
            const unitY = (Q[1] - P[1]) / totalLength
            
            // Calculate segment points
            const firstEndX = P[0] + unitX * firstSegmentLength
            const firstEndY = P[1] + unitY * firstSegmentLength
            const secondStartX = P[0] + unitX * secondSegmentStart
            const secondStartY = P[1] + unitY * secondSegmentStart
            const textX = P[0] + unitX * (firstSegmentLength + gapLength / 2)
            const textY = P[1] + unitY * (firstSegmentLength + gapLength / 2)
            
            return (
              <>
                {/* First segment: 30% of total length */}
                <Line
                  x1={P[0]}
                  y1={P[1]}
                  x2={firstEndX}
                  y2={firstEndY}
                />
                {/* Second segment: remaining 30% with arrow */}
                <Line
                  x1={secondStartX}
                  y1={secondStartY}
                  x2={Q[0]}
                  y2={Q[1]}
                  markerEnd={`url(#arrowhead-${start}${end})`}
                />
                {/* Text in the 40% gap */}
                <Text x={textX} y={textY}>
                  {label}
                </Text>
              </>
            )
          })()}
        </>
      ) : hasLabel ? (
        // Render normal line with centered label (for calling arrows with labels)
        <>
          <Line
            x1={P[0]}
            y1={P[1]}
            x2={Q[0]}
            y2={Q[1]}
            markerEnd={`url(#arrowhead-${start}${end})`}
          />
          <Text x={C[0]} y={C[1]}>
            {label}
          </Text>
        </>
      ) : (
        // Render normal continuous line
      <Line
        x1={P[0]}
        y1={P[1]}
        x2={Q[0]}
        y2={Q[1]}
        markerEnd={`url(#arrowhead-${start}${end})`}
      >
        <animate
          ref={animateRef1}
          attributeName='x2'
          from={P[0]}
          to={Q[0]}
          dur='0.2s'
          repeatCount='1'
          restart='whenNotActive'
        />
        <animate
          ref={animateRef2}
          attributeName='y2'
          from={P[1]}
          to={Q[1]}
          dur='0.2s'
          repeatCount='1'
          restart='whenNotActive'
        />
      </Line>
      )}
    </Container>
  )
}

export default DirectedEdge
