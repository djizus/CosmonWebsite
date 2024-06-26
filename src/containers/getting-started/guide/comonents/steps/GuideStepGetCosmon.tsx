import React from 'react'
import Button from '@components/Button/Button'
import AnimatedImage from '@components/AnimatedImage/AnimatedImage'

import commonStyles from './GuideStep.module.scss'
import styles from './GuideStepGetCosmon.module.scss'

interface GuideStepGetCosmonProps {}

const GuideStepGetCosmon: React.FC<GuideStepGetCosmonProps> = ({}) => {
  return (
    <div className={styles.container}>
      <h1 className={commonStyles.title}>Get your Leader to join the fight!</h1>

      <div className={styles.textContainer}>
        <p className={commonStyles.text}>
          Get a vial to mint a random Cosmon! Each vial will unleash one of our 25 Cosmons.
        </p>
        <p className={commonStyles.text}>
          The rarer your Cosmons are, the more yield you will get from it.
        </p>
        <p className={commonStyles.text}>
          Your Cosmon's initial characteristics will also be higher with an upper rarity.
        </p>
      </div>

      <div className={styles.blackBoxesContainer}>
        <div className={styles.blackBoxContainer}>
          <img src="/getting-started/raffle-one-card.png" alt="" />
          <p className={styles.title} style={{ marginTop: 53 }}>
            Open a potion and receive a random card by scarsity
          </p>
          <a href={`${window.location.origin}/buy-cosmon`} target={'_blank'}>
            <Button type="secondary" size="small">
              Buy cosmon
            </Button>
          </a>
        </div>
        <div className={styles.blackBoxContainer}>
          <AnimatedImage
            imgSrc="/getting-started/raffle-one-deck.png"
            imgClassName={styles.imgStarterPack}
          />
          <p className={styles.title} style={{ marginTop: 27 }}>
            Be ready for figth with 3 commun cards
          </p>
          <a href={`${window.location.origin}/buy-cosmon`} target={'_blank'}>
            <Button type="secondary" size="small">
              Buy cosmon
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default GuideStepGetCosmon
