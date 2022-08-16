import clsx from 'clsx'
import React from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  children: string | React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({ children }) => {
  return <div className={clsx(styles.badge)}>{children}</div>
}

export default Badge
