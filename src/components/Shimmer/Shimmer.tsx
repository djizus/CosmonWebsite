import React from 'react'
import clsx from 'clsx'
import styles from './Shimmer.module.scss'

interface ShimmerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
}

const Shimmer: React.FC<ShimmerProps> = ({ children, ...divProps }) => {
  return (
    <div className={clsx(styles.shimmerContainer, divProps.className)} {...divProps}>
      {children}
    </div>
  )
}

export default Shimmer
