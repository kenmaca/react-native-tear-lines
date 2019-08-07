import React from 'react'

interface IProps {
  isUnder?: boolean
  color?: string
  backgroundColor?: string
  tearSize?: number
  width?: any
  ref?: React.Ref<any>
}

declare const Component: React.SFC<IProps>

export type TearLinesProps = IProps
export default Component
