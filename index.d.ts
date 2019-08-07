import React from 'react'

interface Props {
  isUnder?: boolean
  color?: string
  backgroundColor?: string
  tearSize?: number
  width?: any
  ref?: React.Ref<any>
}

declare const Component: React.SFC<Props>

export type TearLinesProps = Props
export default Component
