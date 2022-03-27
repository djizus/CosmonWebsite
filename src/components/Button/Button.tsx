import clsx from 'clsx'
import ArrowRight from '/public/icons/arrow-right.svg'
import style from './Button.module.scss'

type ButtonProps = {
  type?: 'primary' | 'secondary' | 'tertiary'
  icon?: {
    position: 'left' | 'right'
    direction: 'left' | 'right'
  }
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export default function Button({
  type = 'primary',
  children,
  icon,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <div className="relative z-10 mx-auto mb-1 flex w-fit flex-row lg:m-0">
      <button
        disabled={disabled}
        className={clsx(
          `${style.btn}`,
          !disabled ? style[type] : style.disabled,
          `${className}`
        )}
      >
        {icon && icon.position === 'left' && (
          <ArrowRight
            className={`${style.arrow} ${
              icon.direction === 'left' && style.reverse
            }`}
          />
        )}
        {children}
        {icon && icon.position === 'right' && (
          <ArrowRight
            className={`${style.arrow} ${
              icon.direction === 'left' && style.reverse
            }`}
          />
        )}
      </button>
    </div>
  )
}
