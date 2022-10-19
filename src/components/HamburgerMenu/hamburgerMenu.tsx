import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useToggle } from 'react-use'
import * as styles from './HamburgerMenu.module.scss'

interface HamburgerMenuProps {
  onToggleMenu: (isActive: boolean) => void
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onToggleMenu }) => {
  const [isOpen, toggle] = useToggle(false)

  useEffect(() => {
    onToggleMenu(isOpen)
  }, [isOpen])

  return (
    <div className={clsx(styles.container, { [styles.open]: isOpen })} onClick={toggle}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export default HamburgerMenu
