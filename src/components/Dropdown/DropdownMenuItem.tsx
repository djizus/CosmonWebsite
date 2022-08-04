import clsx from 'clsx'
import React, { useCallback, useContext } from 'react'
import { DropdownContext } from './DropdownContext'

interface DropdownMenuItemProps {}

const DropdownMenuItem: React.FC<
  DropdownMenuItemProps &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> = ({ ...props }) => {
  const { toggleDropdown } = useContext(DropdownContext)

  const handleClickOnItem = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (props.onClick) {
        props.onClick(e)
      }
      toggleDropdown()
    },
    [props.onClick]
  )

  return (
    <div
      className={clsx(
        'flex w-full cursor-pointer justify-start text-white hover:font-semibold',
        props.className
      )}
      {...props}
      onClick={handleClickOnItem}
    >
      {props.children}
    </div>
  )
}

export default DropdownMenuItem
