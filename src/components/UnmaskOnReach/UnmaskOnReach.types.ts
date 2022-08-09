import { Transition } from 'framer-motion'
import { ReactNode } from 'react'

export interface UnmaskOnReachProps {
  children: string | JSX.Element | JSX.Element[] | ReactNode
  animation?: AnimationType
  delay?: number // in seconds
  className?: string
  reach?: number
}

export enum AnimationType {
  default = 'default',
  rise = 'rise',
}
