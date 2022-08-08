import { ReactNode } from 'react'

export interface UnmaskOnReachProps {
  children: string | JSX.Element | JSX.Element[] | ReactNode
  animation?: string
  delay?: string
  disableRotation?: boolean
  className?: string
  reach?: number
}

export enum AnimationType {
  default = 'default',
  rise = 'rise',
}
