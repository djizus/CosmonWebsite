import React from 'react'

import commonStyles from './GuideStep.module.scss'
import styles from './GuideStepBuyTokens.module.scss'
import GuideStepCard from './GuideStepCard/GuideStepCard'
import guideStepStyles from './GuideStepCard/GuideStepCard.module.scss'

interface GuideStepBuyTokensProps {}

const GuideStepBuyTokens: React.FC<GuideStepBuyTokensProps> = ({}) => {
  return (
    <div className={styles.container}>
      <h1 className={commonStyles.title}>Buy tokens</h1>
      <div className={styles.textContainer}>
        <p className={commonStyles.text}>To buy Cosmon cards you will need ATOM.</p>
        <p className={commonStyles.text}>To play you will need XKI in your wallet.</p>
      </div>

      <div className={styles.cardsContainer}>
        <GuideStepCard className={styles.cardContainer}>
          <span className={guideStepStyles.title}>1 . Buy ATOM</span>
          <img src="/getting-started/atom.png" />
          <div className={styles.textContainer}>
            <p>
              You can buy ATOM on{' '}
              <a href="https://www.binance.com/" target="_blank">
                Binance
              </a>
              ,{' '}
              <a href="https://www.kucoin.com/" target="_blank">
                KuCoin
              </a>{' '}
              or{' '}
              <a href="https://www.coinbase.com/en/exchange" target="_blank">
                Coinbase Exchange
              </a>
            </p>
            <p>Transfer ATOM to your cosmos wallet</p>
          </div>
        </GuideStepCard>
        <GuideStepCard className={styles.cardContainer}>
          <span className={guideStepStyles.title}>2 . Buy XKI</span>
          <img src="/getting-started/xki.png" />
          <div className={styles.textContainer}>
            <p>
              Go to the Decentralized Exchange{' '}
              <a href="https://app.osmosis.zone/?from=ATOM&to=XKI" target="_blank">
                Osmosis
              </a>{' '}
              to swap a few ATOMs for XKI
            </p>
          </div>
        </GuideStepCard>
      </div>
    </div>
  )
}

export default GuideStepBuyTokens
