import React from 'react'
import { motion } from 'framer-motion'
import { CosmonTypeWithMalus } from 'types/Malus'
import * as styles from './MalusInfoModal.module.scss'
import clsx from 'clsx'

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

interface MalusInfoModalProps {
  cosmonsWithMalus: CosmonTypeWithMalus[]
  className?: string
}

const MalusInfoModal: React.FC<MalusInfoModalProps> = ({ cosmonsWithMalus, className }) => {
  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation()
      }}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={clsx(styles.malusModal, className)}
    >
      <div className={styles.cosmonWithMalusContainer}>
        {cosmonsWithMalus.map((cosmon) => (
          <p className={styles.cosmonWithMalus} key={cosmon.id}>
            {cosmon.data.extension.name} :{' '}
            <span className={styles.redMalus}>-{cosmon.malusPercent}%</span>
          </p>
        ))}
      </div>
      <p className={styles.malusTip}>
        Decks made up of cards with more than 3 levels of difference between the cards have a
        penalty.
      </p>
    </motion.div>
  )
}

MalusInfoModal.displayName = 'MalusInfoModal'

export default MalusInfoModal
