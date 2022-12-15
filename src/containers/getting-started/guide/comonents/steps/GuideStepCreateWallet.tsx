import React from 'react'
import GuideStepCard from './GuideStepCard/GuideStepCard'
import Button from '@components/Button/Button'

import commonStyles from './GuideStep.module.scss'
import styles from './GuideStepCreateWallet.module.scss'
import guideStepStyles from './GuideStepCard/GuideStepCard.module.scss'

interface GuideStepCreateWalletProps {}

const GuideStepCreateWallet: React.FC<GuideStepCreateWalletProps> = ({}) => {
  return (
    <div className={styles.container}>
      <h1 className={commonStyles.title}>Create your Cosmos Wallet</h1>

      <div className={styles.textContainer}>
        <p className={commonStyles.text}>
          Cosmon is a game integrated on the blockchain of the KI foundation, itself built in the
          cosmos ecosystem. In order to play to cosmon, you must use a wallet compatible with the
          cosmos blockchain.
        </p>
        <p className={commonStyles.text}>
          We recommend that you use one of these two wallets which are among the most used by the
          community.
        </p>
      </div>

      <GuideStepCard className={styles.cardContainer}>
        <span className={guideStepStyles.title}>Download & setup</span>
        <div className={styles.buttonsContainer}>
          <Button
            type="secondary"
            onClick={(e) => {
              e.preventDefault()
              window.open('https://www.keplr.app/', '_blank')
            }}
          >
            <img src="/getting-started/keplr.png" className={styles.keplrImg} />
            Keplr
          </Button>
          <Button
            type="secondary"
            onClick={(e) => {
              e.preventDefault()
              window.open(
                'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
                '_blank'
              )
            }}
          >
            <img src="/getting-started/cosmostation.png" className={styles.cosmostationImg} />
            Cosmostation
          </Button>
        </div>
      </GuideStepCard>
    </div>
  )
}

export default GuideStepCreateWallet
