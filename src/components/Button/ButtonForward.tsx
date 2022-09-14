import clsx from 'clsx'
import React from 'react'
import styles from './ButtonForward.module.scss'
import Forward from '/public/icons/forward.svg'

interface ButtonForwardProps {
  isActive?: boolean
  disabled?: boolean
}

const ButtonForward: React.FC<
  ButtonForwardProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ isActive = false, disabled = false, ...divProps }) => {
  return (
    <div
      className={clsx(styles.buttonForwardContainer, {
        [styles.isActive]: isActive,
        [styles.isDisabled]: disabled,
      })}
      {...divProps}
    >
      <Forward />
    </div>
  )
}

export default ButtonForward
