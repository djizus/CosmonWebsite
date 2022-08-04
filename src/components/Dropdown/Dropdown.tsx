import clsx from 'clsx'
import React from 'react'
import { useToggle } from 'react-use'
import styles from './Dropdown.module.scss'
import { DropdownContext } from './DropdownContext'
import DropdownToggler from './DropdownToggler'
import DropdownMenu from './DropdownMenu'
import DropdownMenuItem from './DropdownMenuItem'

interface DropdownProps {
  Toggler?: typeof DropdownToggler
  Menu?: React.FC
  MenuItem?: React.FC
}

type DropdownSubComponents = {
  Toggler: typeof DropdownToggler
  Menu: typeof DropdownMenu
  MenuItem: typeof DropdownMenuItem
}

const Dropdown: React.FC<
  DropdownProps &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> &
  DropdownSubComponents = ({ ...props }) => {
  const [isDropdownOpen, toggleDropdown] = useToggle(false)

  return (
    <DropdownContext.Provider value={{ isDropdownOpen, toggleDropdown }}>
      <div className={clsx(styles.dropdownContainer, props.className)}>
        {props.children}
      </div>
    </DropdownContext.Provider>
  )
}

Dropdown.Toggler = DropdownToggler
Dropdown.Menu = DropdownMenu
Dropdown.MenuItem = DropdownMenuItem

export default Dropdown
