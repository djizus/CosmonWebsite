import clsx from 'clsx'
import React, { ReactNode } from 'react'

import styles from './GuideStepCard.module.scss'

interface GuideStepCardProps {
  children: ReactNode
}

const GuideStepCard: React.FC<
  GuideStepCardProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, ...props }) => {
  return (
    <div {...props} className={clsx(styles.container, props.className)}>
      {children}
    </div>
  )
}

export default GuideStepCard
