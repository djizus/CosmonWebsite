import clsx from 'clsx'
import React, { CSSProperties, ReactNode } from 'react'
import styles from './FlipCard.module.scss'

interface FlipCardProps {
  card: string | ReactNode
  revealed?: boolean
  imgStyle?: CSSProperties
  shine?: boolean
  revealedDuration?: number
}

const FlipCard: React.FC<FlipCardProps> = ({
  card,
  imgStyle,
  revealed,
  shine,
  revealedDuration = 1,
  ...props
}) => {
  return (
    <div className={clsx(styles.flipCard)}>
      <div
        className={clsx(styles.flipCardInner)}
        style={{
          transitionDuration: `${revealedDuration}s`,
          ...(revealed ? { transform: 'rotateY(180deg)' } : {}),
        }}
      >
        <div className={clsx(styles.cardFront, { [styles.shineCard]: shine })}>
          {typeof card === 'string' ? <img src={card} style={imgStyle} /> : card}
        </div>
        <div className={clsx(styles.cardBack)}>
          <img src="/dragging-preview.png" style={imgStyle} />
        </div>
      </div>
    </div>
  )
}
/*  */

export default FlipCard
