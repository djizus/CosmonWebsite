import clsx from 'clsx'
import React, { useContext } from 'react'
import styles from './Dropdown.module.scss'
import { DropdownContext } from './DropdownContext'

interface DropdownTogglerProps {
  showChevron?: boolean
  chevronColor?: string
}

const DropdownToggler: React.FC<
  DropdownTogglerProps &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> = ({ showChevron = true, ...props }) => {
  const { toggleDropdown } = useContext(DropdownContext)

  return (
    <div
      className={clsx(styles.dropdownTogglerContainer, props.className)}
      onClick={toggleDropdown}
    >
      {props.children}
    </div>
  )
}

export default DropdownToggler
