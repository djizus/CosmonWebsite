import { useWalletStore } from '@store/walletStore'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import * as styles from './NavigationMenu.module.scss'

const ARENA_IS_ACTIVE = Boolean(process.env.NEXT_PUBLIC_ARENA_IS_ACTIVE)

interface NavigationMenuProps {}

const NavigationMenu: React.FC<NavigationMenuProps> = ({}) => {
  const { cosmons } = useWalletStore()
  return (
    <motion.div
      variants={navigationMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={clsx(styles.container)}
    >
      <Link href="/buy-cosmon">
        <a>Buy Cosmon</a>
      </Link>
      <Link href="https://docs.cosmon.ki/">
        <a target="_blank">Documentation</a>
      </Link>
      <Link href="/my-assets">
        <a>
          My Assets
          {cosmons.length > 0 && ` (${cosmons.length})`}
        </a>
      </Link>
      {ARENA_IS_ACTIVE ? (
        <Link href="/arena">
          <a>Arena</a>
        </Link>
      ) : null}
    </motion.div>
  )
}

export default NavigationMenu

const navigationMenuVariants = {
  hidden: {
    y: '-100%',
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
    y: '-100%',
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
}
