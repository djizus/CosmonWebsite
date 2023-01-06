import ConnectionSelectModal from '@components/Modal/ConnectionSelectModal'
import { useWalletStore } from '@store/walletStore'
import clsx from 'clsx'
import { AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import { CONNECTION_TYPE } from 'types/Connection'
import Button, { ButtonProps } from './Button'

interface ButtonConnectWalletProps {
  buttonProps?: Omit<ButtonProps, 'children'>
  withoutContainer?: boolean
  className?: string
}

const ButtonConnectWallet: React.FC<ButtonConnectWalletProps> = ({
  buttonProps,
  withoutContainer = false,
  className,
}) => {
  const [showConnectionSelectModal, setShowConnectionSelectModal] = useState(false)
  const { connect, isFetchingData } = useWalletStore()

  return (
    <>
      <Button
        withoutContainer={withoutContainer}
        className={clsx('max-h-[42px]', className)}
        isLoading={isFetchingData}
        onClick={() => {
          setShowConnectionSelectModal(true)
        }}
        {...buttonProps}
      >
        Connect wallet
      </Button>
      <AnimatePresence>
        {showConnectionSelectModal ? (
          <ConnectionSelectModal
            onRequestClose={() => {
              setShowConnectionSelectModal(false)
            }}
            onSelectExtension={(type: CONNECTION_TYPE) => {
              setShowConnectionSelectModal(false)
              connect(type)
            }}
            onSelectWalletConnect={(type: CONNECTION_TYPE) => {
              setShowConnectionSelectModal(false)
              connect(type)
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default ButtonConnectWallet
