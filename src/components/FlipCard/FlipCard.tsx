import clsx from 'clsx'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import React, { CSSProperties, useState } from 'react'
import styles from './FlipCard.module.scss'

interface FlipCardProps {
  card: string
  revealed?: boolean
  imgStyle?: CSSProperties
}

const variants = {
  initial: { rotateY: 180 },
  animate: { rotateY: 170, perspective: 600, transition: { duration: 3 } },
  exit: { rotateY: 170, perspective: 600, transition: { duration: 3 } },
}

const FlipCard: React.FC<FlipCardProps & HTMLMotionProps<'div'>> = ({
  card,
  imgStyle,
  ...props
}) => {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className={clsx(styles.flipCard)}>
      <div className={clsx(styles.flipCardInner)}>
        <div className={clsx(styles.cardFront)}>
          <img src={card} style={imgStyle} />
        </div>
        <div className={clsx(styles.cardBack)}>
          <img src="/dragging-preview.png" style={imgStyle} />
        </div>
      </div>
    </div>
  )
}

export default FlipCard
