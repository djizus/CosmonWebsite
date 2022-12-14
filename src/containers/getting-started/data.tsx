import Button from '@components/Button/Button'
import Link from 'next/link'
import { GettingStartedGuideStep } from 'types/GettingStartedGuide'
import GuideStepBuyTokens from './guide/comonents/steps/GuideStepBuyTokens'
import GuideStepCreateWallet from './guide/comonents/steps/GuideStepCreateWallet'
import GuideStepGetCosmon from './guide/comonents/steps/GuideStepGetCosmon'
import GuideStepPlay from './guide/comonents/steps/GuideStepPlay'

export const gettingStartedSteps: GettingStartedGuideStep[] = [
  {
    id: 0,
    fragment: 'create-wallet',
    title: 'Create wallet',
    component: () => <GuideStepCreateWallet />,
  },
  {
    id: 1,
    fragment: 'buy-tokens',
    title: 'Buy tokens',
    component: () => <GuideStepBuyTokens />,
  },
  {
    id: 2,
    fragment: 'get-cosmon',
    title: 'Get Cosmon',
    component: () => <GuideStepGetCosmon />,
  },
  { id: 3, fragment: 'play', title: 'Play', component: () => <GuideStepPlay /> },
]

export const discoveryModes = {
  noob: {
    card: () => <img src="/getting-started/discovery-mode/noob.png" />,
    title: 'I don’t have any experience with blockchain and crypto ecosystem',
    button: () => (
      <a target="_blank" href="https://docs.cosmon.ki/">
        <Button size="small">Discover our step by step guide</Button>
      </a>
    ),
  },
  expert: {
    card: () => <img src="/getting-started/discovery-mode/expert.png" />,
    title: 'I have experience with blockchain and crypto ecosystem',
    button: () => (
      <Link href={`/getting-started/guide#${gettingStartedSteps[0].fragment}`}>
        <Button size="small">Get started</Button>
      </Link>
    ),
  },
}
