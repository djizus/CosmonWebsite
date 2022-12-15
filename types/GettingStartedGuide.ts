import { ReactNode } from 'react'

export type GettingStartedStepFragment = 'create-wallet' | 'buy-tokens' | 'get-cosmon' | 'play'

export type GettingStartedGuideStep = {
  id: number
  title: string
  fragment: GettingStartedStepFragment
  component: () => ReactNode
}
