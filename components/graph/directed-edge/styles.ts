import styled from 'styled-components'

export const Container = styled.g<{ highlight: boolean }>`
  ${({ highlight }) => highlight && `
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
  `}
`

export const Line = styled.line`
  stroke: #FFFFFF;
  stroke-width: 1.5;
  fill: none;
`

export const Text = styled.text`
  font-size: 12px;
  font-weight: bold;
  text-anchor: middle;
  alignment-baseline: central;
  user-select: none;
  fill: #FFFFFF;
  stroke: #000000;
  stroke-width: 0.5;
  paint-order: stroke fill;
`
