import clsx from 'clsx'
import React from 'react'
import styles from './ButtonPlay.module.scss'
import Play from '/public/icons/play.svg'

interface ButtonPlayProps {
  isActive?: boolean
  disabled?: boolean
}

const ButtonPlay: React.FC<
  ButtonPlayProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ isActive = false, disabled = false, ...divProps }) => {
  return (
    <div
      className={clsx(styles.buttonPlayContainer, {
        [styles.isActive]: isActive,
        [styles.isDisabled]: disabled,
      })}
      {...divProps}
    >
      <Play />
    </div>
  )
}

export default ButtonPlay
