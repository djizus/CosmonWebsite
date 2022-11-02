import { isCosmostationExtensionInstalled } from '@services/connection/cosmostation'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CONNECTION_TYPE } from 'types/Connection'
import Modal from './Modal'

const ConnectionSelectModal: React.FC<{
  overrideWithKeplrInstallLink?: string
  onSelectExtension: (type: CONNECTION_TYPE) => void
  onSelectWalletConnect: () => void
  onRequestClose: () => void
}> = ({
  onRequestClose,
  overrideWithKeplrInstallLink,
  onSelectExtension,
  onSelectWalletConnect,
}) => {
  const [isCosmostationInstalled, setIsCosmostationInstalled] = useState<boolean>(false)

  useEffect(() => {
    checkCosmostationInstalled()
  }, [])

  const checkCosmostationInstalled = async () => {
    const check = await isCosmostationExtensionInstalled()
    setIsCosmostationInstalled(check)
  }

  return (
    <Modal hasCloseButton={false} onCloseModal={onRequestClose} width={'30%'}>
      <div>
        <p className="text-[22px] text-white">Connect wallet</p>
      </div>
      <div className="mt-5 flex flex-col">
        {overrideWithKeplrInstallLink ? (
          <button
            className="bg-background flex items-center rounded-2xl p-4"
            onClick={(e) => {
              e.preventDefault()
              window.open(overrideWithKeplrInstallLink, '_blank')
            }}
          >
            <Image src="../keplr-logo.png" alt="keplr logo" width={36} height={36} />
            <div className="ml-5 flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h6>Install Keplr</h6>
                <Image
                  src="../icons/external-link-white.svg"
                  alt="external link"
                  width={14}
                  height={14}
                />
              </div>
            </div>
          </button>
        ) : (
          <button
            className="flex items-center rounded-2xl bg-cosmon-blue-dark p-4"
            onClick={(e) => {
              e.preventDefault()
              onSelectExtension(CONNECTION_TYPE.KEPLR)
            }}
          >
            <Image src="../keplr-logo.png" alt="keplr logo" width={36} height={36} />
            <div className="ml-5 flex flex-col items-start">
              <h6 className="text-white">Keplr Wallet</h6>
              <p className="body2 mt-1 text-xs ">Keplr Browser Extension</p>
            </div>
          </button>
        )}

        {isCosmostationInstalled === true ? (
          <button
            className="mt-2 flex items-center rounded-2xl bg-cosmon-blue-dark p-4"
            onClick={(e) => {
              e.preventDefault()
              onSelectExtension(CONNECTION_TYPE.COSMOSTATION)
            }}
          >
            <Image src="../cosmostation-logo.png" alt="cosmostation logo" width={36} height={36} />
            <div className="ml-5 flex flex-col items-start">
              <h6 className="text-white">Cosmostation Wallet</h6>
              <p className="body2 mt-1 text-xs ">Cosmostation Browser Extension</p>
            </div>
          </button>
        ) : (
          <button
            className="bg-background flex items-center rounded-2xl p-4"
            onClick={(e) => {
              e.preventDefault()
              window.open(
                'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
                '_blank'
              )
            }}
          >
            <Image src="../cosmostation-logo.png" alt="keplr logo" width={36} height={36} />
            <div className="ml-5 flex flex-col text-left">
              <div className="flex items-center gap-2 text-white">
                <h6>Install Cosmostation</h6>
                <Image
                  src="../icons/external-link-white.svg"
                  alt="external link"
                  width={14}
                  height={14}
                />
              </div>
            </div>
          </button>
        )}

        {/* <button
      className="mt-2 flex items-center rounded-2xl bg-cosmon-blue-dark p-4"
      onClick={(e) => {
        e.preventDefault()
        onSelectWalletConnect()
      }}
    >
      <Image src="../icons/walletconnect.svg" alt="wallet connect logo" width={26} height={26} />
      <div className="ml-5 flex flex-col items-start">
        <h6 className="text-white">WalletConnect</h6>
        <p className="body2 mt-1 text-xs">Keplr Mobile</p>
      </div>
    </button> */}
      </div>
    </Modal>
  )
}

export default ConnectionSelectModal
