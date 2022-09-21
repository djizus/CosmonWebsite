import clsx from 'clsx'
import React from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  children: string | React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'primary' }) => {
  return <div className={clsx(styles.badge, styles[variant], className)}>{children}</div>
}

export default Badge
