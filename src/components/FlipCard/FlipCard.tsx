import clsx from 'clsx'
import React, { CSSProperties, ReactNode } from 'react'
import styles from './FlipCard.module.scss'

interface FlipCardProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  card: string | ReactNode
  cardBack?: string | ReactNode
  revealed?: boolean
  imgStyle?: CSSProperties
  shine?: boolean
  revealedDuration?: number
}

const FlipCard: React.FC<FlipCardProps> = ({
  card,
  cardBack,
  imgStyle,
  revealed,
  shine,
  revealedDuration = 1,
  ...props
}) => {
  return (
    <div {...props} className={clsx(styles.flipCard, props.className)}>
      <div
        className={clsx(styles.flipCardInner)}
        style={{
          transitionDuration: `${revealedDuration}s`,
          ...(revealed ? { transform: 'rotateY(180deg)' } : {}),
        }}
      >
        <div
          className={clsx(styles.cardFront, { [styles.shineCard]: shine })}
          style={{ zIndex: revealed ? 1 : -1 }}
        >
          {typeof card === 'string' ? <img src={card} style={imgStyle} /> : card}
        </div>
        <div className={clsx(styles.cardBack)} style={{ zIndex: revealed === false ? 1 : -1 }}>
          {cardBack || <img src="/dragging-preview.png" style={imgStyle} />}
        </div>
      </div>
    </div>
  )
}
/*  */

export default FlipCard
