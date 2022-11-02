import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'
// import { ModalBase, ModalBaseProps } from "./base";
// import { useWindowSize } from '../hooks'
import { isMobile as isMobileWC, isAndroid, saveMobileLinkInfo } from '@walletconnect/browser-utils'
import Modal, { ModalProps } from './Modal'
import Button from '@components/Button/Button'
import { useWindowSize } from 'react-use'
// import { Button } from "../components/buttons";

export const WalletConnectQRModal: React.FC<{
  uri: string
  onCloseModal: () => void
}> = ({ onCloseModal, uri }) => {
  // Below is used for styling for mobile device.
  // Check the size of window.
  const { width } = useWindowSize()

  const isMobile = useMemo(() => {
    return width < 640
  }, [width])

  // Below is used for real mobile environment.
  // Check the user agent.
  const [checkMobile] = useState(() => isMobileWC())
  const [checkAndroid] = useState(() => isAndroid())

  const navigateToAppURL = useMemo(() => {
    if (!uri) {
      return
    }

    if (checkMobile) {
      if (checkAndroid) {
        // Save the mobile link.
        saveMobileLinkInfo({
          name: 'Keplr',
          href: 'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
        })

        return `intent://wcV1?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`
      } else {
        // Save the mobile link.
        saveMobileLinkInfo({
          name: 'Keplr',
          href: 'keplrwallet://wcV1',
        })

        return `keplrwallet://wcV1?${uri}`
      }
    }
  }, [checkAndroid, checkMobile, uri])

  useEffect(() => {
    // Try opening the app without interaction.
    if (navigateToAppURL) {
      window.location.href = navigateToAppURL
    }
  }, [navigateToAppURL])

  return (
    <Modal onCloseModal={onCloseModal} width={isMobile ? 310 : 550}>
      <div>
        <p className="text-[22px] text-white">
          {checkMobile ? (
            <h6 className="mb-4">Open App</h6>
          ) : (
            <h5 className="mb-4">Scan QR Code</h5>
          )}
        </p>
      </div>
      {uri ? (
        !checkMobile ? (
          (() => {
            const QRCode = dynamic(() => import('qrcode.react'))

            return (
              <div className="bg-white-high p-3.5">
                <QRCode size={isMobile ? 290 : 480} value={uri} />
              </div>
            )
          })()
        ) : (
          <Button
            className="my-3 py-4"
            onClick={() => {
              if (navigateToAppURL) {
                window.location.href = navigateToAppURL
              }
            }}
          >
            Open App
          </Button>
        )
      ) : undefined}
    </Modal>
  )
}
