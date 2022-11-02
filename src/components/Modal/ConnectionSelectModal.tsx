import { isCosmostationExtensionInstalled } from '@services/connection/cosmostation'
import { isKeplrExtensionInstalled } from '@services/connection/keplr'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CONNECTION_TYPE } from 'types/Connection'
import Modal from './Modal'

const IS_ACTIVE_WALLET_CONNECT = process.env.NEXT_PUBLIC_IS_ACTIVE_WALLET_CONNECT

const ConnectionSelectModal: React.FC<{
  onSelectExtension: (type: CONNECTION_TYPE) => void
  onSelectWalletConnect: (type: CONNECTION_TYPE) => void
  onRequestClose: () => void
}> = ({ onRequestClose, onSelectExtension, onSelectWalletConnect }) => {
  const [isCosmostationInstalled, setIsCosmostationInstalled] = useState<boolean>(false)
  const [isKeplrInstalled, setIsKeplrInstalled] = useState<boolean>(false)

  useEffect(() => {
    checkCosmostationInstalled()
    checkKeplrInstalled()
  }, [])

  const checkCosmostationInstalled = async () => {
    const check = await isCosmostationExtensionInstalled()
    setIsCosmostationInstalled(check)
  }
  const checkKeplrInstalled = () => {
    const check = isKeplrExtensionInstalled()
    setIsKeplrInstalled(check)
  }

  return (
    <Modal hasCloseButton={false} onCloseModal={onRequestClose} width={'30%'}>
      <div>
        <p className="text-[22px] text-white">Connect wallet</p>
      </div>
      <div className="mt-5 flex flex-col">
        {isKeplrInstalled === true ? (
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
        ) : (
          <button
            className="bg-background flex items-center rounded-2xl p-4"
            onClick={(e) => {
              e.preventDefault()
              window.open('https://www.keplr.app/', '_blank')
            }}
          >
            <Image src="../keplr-logo.png" alt="keplr logo" width={36} height={36} />
            <div className="ml-5 flex flex-col text-left">
              <div className="flex items-center gap-2 text-white">
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
              <p className="body2 mt-1 text-xs">Cosmostation Browser Extension</p>
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
        {IS_ACTIVE_WALLET_CONNECT === 'true' ? (
          <button
            className="mt-2 flex items-center rounded-2xl bg-cosmon-blue-dark p-4"
            onClick={(e) => {
              e.preventDefault()
              onSelectWalletConnect(CONNECTION_TYPE.COSMOSTATION_WALLET_CONNECT)
            }}
          >
            <Image
              src="../icons/walletconnect.svg"
              alt="wallet connect logo"
              width={36}
              height={36}
            />
            <div className="ml-5 flex flex-col items-start">
              <h6 className="text-white">WalletConnect</h6>
              <p className="body2 mt-1 text-xs">Cosmostation Mobile</p>
            </div>
          </button>
        ) : null}
      </div>
    </Modal>
  )
}

export default ConnectionSelectModal
