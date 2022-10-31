import ConnectionSelectModal from '@components/Modal/ConnectionSelectModal'
import { useWalletStore } from '@store/walletStore'
import { AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import { CONNECTION_TYPE } from 'types/Connection'
import Button, { ButtonProps } from './Button'

interface ButtonConnectWalletProps {
  buttonProps?: Omit<ButtonProps, 'children'>
}

const ButtonConnectWallet: React.FC<ButtonConnectWalletProps> = ({ buttonProps }) => {
  const [showConnectionSelectModal, setShowConnectionSelectModal] = useState(false)
  const { connect, isFetchingData } = useWalletStore()

  return (
    <>
      <Button
        className="max-h-[42px]"
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
            overrideWithKeplrInstallLink={!window.keplr ? 'https://www.keplr.app/' : undefined}
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
