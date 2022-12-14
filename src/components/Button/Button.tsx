import clsx from 'clsx'
import ArrowRight from '/public/icons/arrow-right.svg'
import * as style from './Button.module.scss'
import LoadingIcon from '../LoadingIcon/LoadingIcon'
import { DetailedHTMLProps, HTMLAttributes, MouseEventHandler } from 'react'

export type ButtonProps = {
  type?:
    | 'primary'
    | 'primaryBordered'
    | 'secondary'
    | 'quaternary'
    | 'ghost'
    | 'disabledColored'
    | 'white'
  size?: 'small'
  icon?: {
    position: 'left' | 'right'
    direction: 'left' | 'right'
  }
  onClick?: (e: any) => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
  containerClassname?: string
  isLoading?: boolean
  fullWidth?: boolean
  active?: boolean
  withoutContainer?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export default function Button({
  type = 'primary',
  size,
  children,
  fullWidth,
  icon,
  disabled = false,
  className = '',
  containerClassname = '',
  onClick,
  isLoading = false,
  active = false,
  withoutContainer = false,
  ...props
}: ButtonProps) {
  return (
    <div
      className={clsx(
        {
          [`relative z-0 mx-auto mb-1 flex flex-row lg:m-0 ${fullWidth ? 'w-full' : 'w-fit'}`]:
            !withoutContainer,
        },
        containerClassname
      )}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          `${style.btn}`,
          { [style.small]: size === 'small' },
          fullWidth && 'w-full justify-center',
          style[type],
          { [style.active]: active },
          `${className}`
        )}
        style={{ ...props.style, ...(isLoading ? { pointerEvents: 'none' } : null) }}
      >
        {isLoading && <LoadingIcon />}
        {icon && icon.position === 'left' && (
          <ArrowRight className={`${style.arrow} ${icon.direction === 'left' && style.reverse}`} />
        )}
        {children}
        {icon && icon.position === 'right' && (
          <ArrowRight className={`${style.arrow} ${icon.direction === 'left' && style.reverse}`} />
        )}
      </button>
    </div>
  )
}
