import React, { forwardRef, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './LastAction.module.scss'

type LastActionProps = {
  children: ReactNode
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const LastAction = forwardRef<HTMLDivElement, LastActionProps>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(styles.lastActionContainer, props.className)}>
      {children}
    </div>
  )
})

export default LastAction
