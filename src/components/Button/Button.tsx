import clsx from 'clsx'
import ArrowRight from '/public/icons/arrow-right.svg'
import style from './Button.module.scss'

type ButtonProps = {
  type?: 'primary' | 'secondary' | 'tertiary'
  withDirection?: 'none' | 'left' | 'right'
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export default function Button({
  type = 'primary',
  withDirection = 'none',
  children,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <div className="relative z-10 mx-auto mb-1 flex w-fit flex-row">
      <button
        disabled={disabled}
        className={clsx(
          `${style.btn}`,
          `${className}`,
          !disabled ? style[type] : style.disabled
        )}
      >
        {withDirection === 'left' && (
          <ArrowRight className={`${style.arrow} ${style.reverse}`} />
        )}
        {children}
        {withDirection === 'right' && <ArrowRight className={style.arrow} />}
      </button>
    </div>
  )
}
