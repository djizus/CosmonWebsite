import clsx from 'clsx'
import ArrowRight from '/public/icons/arrow-right.svg'
import style from './Button.module.scss'

type ButtonProps = {
  type: 'primary' | 'secondary' | 'tertiary'
  withDirection?: 'none' | 'left' | 'right'
  children: React.ReactNode
  disabled?: boolean
}

export default function Button({
  type,
  withDirection = 'none',
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={clsx(`${style.btn}`, !disabled ? style[type] : style.disabled)}
    >
      {withDirection === 'left' && (
        <ArrowRight className={`${style.arrow} ${style.reverse}`} />
      )}
      {children}
      {withDirection === 'right' && <ArrowRight className={style.arrow} />}
    </button>
  )
}
