import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useContext } from 'react'
import styles from './Dropdown.module.scss'
import { DropdownContext } from './DropdownContext'

interface DropdownMenuProps {}

const DropdownMenu: React.FC<
  DropdownMenuProps &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> = ({ ...props }) => {
  const { isDropdownOpen } = useContext(DropdownContext)
  return (
    <AnimatePresence>
      {isDropdownOpen ? (
        <motion.div
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={clsx(styles.dropdownMenuContainer, props.className)}
        >
          {props.children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default DropdownMenu

const dropIn = {
  hidden: {
    y: '10%',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '10%',
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
}
