import React from 'react'

import commonStyles from './GuideStep.module.scss'
import styles from './GuideStepPlay.module.scss'

interface GuideStepPlayProps {}

const GuideStepPlay: React.FC<GuideStepPlayProps> = ({}) => {
  return (
    <div>
      <div className={styles.container}>
        <h1 className={commonStyles.title}>Join the fight!</h1>

        <div className={styles.textContainer}>
          <p className={commonStyles.text}>
            In order to enter the Arena, you need to build your first deck!
          </p>
          <p className={commonStyles.text}>
            Assemble the best combination of 3 Cosmons and join the fight.
          </p>
          <p className={commonStyles.text}>
            Once your deck of 3 leaders has been created, you will be ready to join the fight in one
            of our leagues !
          </p>
        </div>

        <div className={styles.cardsContainer}>
          <div className={styles.cardContainer}>
            <p className={styles.title}>
              <img src="/getting-started/fight-mode-training.png" alt="Training mode" />
              <span className={styles.accent}>Training</span>&nbsp;mode
            </p>
            <p className={styles.description}>
              Enter the Arena and give a try to the fighting experience with other players!
            </p>
          </div>
          <div className={styles.cardContainer}>
            <p className={styles.title}>
              <img src="/getting-started/fight-mode-pro.png" alt="Training mode" />
              <span className={styles.accent}>Professional</span>&nbsp;mode
            </p>
            <p className={styles.description}>
              Here begin the real fights! Only experienced players can make it to the top of the
              leaderboard and pretend to the gorgeous prize pool!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideStepPlay
