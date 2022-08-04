import React from 'react'
import Button from '../Button/Button'
import Image from 'next/image'

type ConnectionPanelProps = {
  connect: () => void
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({ connect }) => {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center">
      <Image
        objectFit="fill"
        layout="fill"
        src="../blurry-bg-connect-wallet.png"
      ></Image>

      <div className="relative px-6">
        <p className="rounded-[20px] bg-[#312E5A] bg-opacity-50 px-6 py-10 text-[22px] font-semibold leading-8 text-white lg:hidden">
          Go to the desktop version to see your Cosmon assets
        </p>
        <div className="hidden items-center justify-center py-[24px] lg:flex">
          <p className="px-10 text-[22px] font-semibold leading-[32px] text-white">
            Connect your wallet to see your assets
          </p>
          <Button onClick={connect} className="max-h-[42px]">
            Connect Wallet{' '}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConnectionPanel
