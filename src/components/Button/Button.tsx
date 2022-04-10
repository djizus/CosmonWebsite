import clsx from 'clsx'
import ArrowRight from '/public/icons/arrow-right.svg'
import style from './Button.module.scss'
import LoadingIcon from '../LoadingIcon/LoadingIcon'

type ButtonProps = {
  type?: 'primary' | 'secondary' | 'tertiary' | 'ghost'
  size?: 'small' | 'normal'
  icon?: {
    position: 'left' | 'right'
    direction: 'left' | 'right'
  }
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
  isLoading?: boolean
}

export default function Button({
  type = 'primary',
  size = 'normal',
  children,
  icon,
  disabled = false,
  className = '',
  onClick,
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <div className="relative z-0 mx-auto mb-1 flex w-fit flex-row lg:m-0">
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          `${style.btn}`,
          `${style[size]}`,
          !disabled ? style[type] : style.disabled,
          `${className}`
        )}
      >
        {isLoading && <LoadingIcon />}
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
