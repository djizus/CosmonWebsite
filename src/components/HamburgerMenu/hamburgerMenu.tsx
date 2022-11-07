import clsx from 'clsx'
import React, { useEffect } from 'react'
import * as styles from './HamburgerMenu.module.scss'

interface HamburgerMenuProps {
  isActive: boolean
  onToggleMenu: (isActive: boolean) => void
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isActive, onToggleMenu }) => {
  useEffect(() => {
    onToggleMenu(isActive)
  }, [isActive])

  return (
    <div
      className={clsx(styles.container, { [styles.open]: isActive })}
      onClick={() => {
        onToggleMenu(!isActive)
      }}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export default HamburgerMenu
