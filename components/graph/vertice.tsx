import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Point } from '../../types'

export const VERTICE_RADIUS = 12

type Props = {
  center: Point
  label?: string
  highlight: 'current' | 'memoized' | 'none'
}

const Vertice = ({ center, label, highlight }: Props) => {
  const textRef = React.useRef<SVGTextElement>(null)
  useScaleDown(textRef, label)

  return (
    <Container highlight={highlight}>
      <Circle cx={center[0]} cy={center[1]} r={VERTICE_RADIUS} />
      <Text x={center[0]} y={center[1]} ref={textRef}>
        {label}
      </Text>
    </Container>
  )
}

export default Vertice

// scale down the <text> svg element with css transform, if need
const useScaleDown = (
  textRef: React.RefObject<SVGTextElement>,
  textInnerHtml?: string
) => {
  React.useLayoutEffect(() => {
    const { current } = textRef
    if (!current || !textInnerHtml) return

    // FIXME: está dependente da font-size do <text>
    // const { width, height } = current.getBBox()
    // const width = current.getComputedTextLength()
    const width = textInnerHtml.length * 6
    const height = 12

    const scale = Math.min(15 / width, 15 / height)

    current.style.transform = `scale(${Math.min(scale, 1)})`
    current.style.transformOrigin = 'center'
    current.style.transformBox = 'fill-box'
  }, [textInnerHtml, textRef])
}

export const Circle = styled.circle`
  stroke-width: 2px;
`
export const Text = styled.text`
  font-size: 14px;
  font-weight: bold;
  text-anchor: middle;
  alignment-baseline: central;
  user-select: none;
  fill: #FFFFFF;
`
export const Container = styled.g<{
  highlight: 'current' | 'memoized' | 'none'
}>`
  ${({ highlight }) => {
    const main = highlight === 'memoized' ? '#FFFFFF' : '#FFFFFF'
    const filled = highlight !== 'none'

    return css`
      ${Circle} {
        fill: ${filled ? main : '#000000'};
        stroke: ${filled ? '#FFFFFF' : '#FFFFFF'};
      }
      ${Text} {
        fill: ${filled ? '#000000' : '#FFFFFF'};
      }
      &:hover {
        ${Circle} {
          fill: #FFFFFF;
          stroke: #FFFFFF;
        }
        ${Text} {
          fill: #000000;
        }
      }
    `
  }}

  ${Circle}, ${Text} {
    animation-name: ${keyframes`
      from {
        r: 0;
        font-size: 0;
      }
    `};
    animation-duration: 0.2s;
    animation-timing-function: cubic-bezier(0.65, 0, 0.265, 1.55);
    animation-delay: both;
  }
`
