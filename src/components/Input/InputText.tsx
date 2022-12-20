import React, { ReactNode } from 'react'
import styles from './InputText.module.scss'
import clsx from 'clsx'

interface InputTextProps {
  icon?: {
    icon: ReactNode
    position: 'left' | 'right'
  }
  borderClassName?: string
}

const InputText: React.FC<
  InputTextProps &
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ icon, borderClassName, className, ...props }) => {
  return (
    <div className={clsx(styles.inputText)}>
      {icon && icon.position === 'left' ? (
        <div className={clsx(styles.inputLeftIcon, borderClassName)}>{icon.icon}</div>
      ) : null}

      <input
        type="text"
        {...props}
        className={clsx(className, borderClassName)}
        style={{
          ...(icon &&
            icon.position === 'left' && {
              borderLeft: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingLeft: 5,
            }),
          ...(icon &&
            icon.position === 'right' && {
              borderRight: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              paddingLeft: 10,
            }),
          ...props.style,
        }}
      />

      {icon && icon.position === 'right' ? (
        <div className={clsx(styles.inputRightIcon, borderClassName)}>{icon.icon}</div>
      ) : null}
    </div>
  )
}

export default InputText
