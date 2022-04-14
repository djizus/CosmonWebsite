import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button/Button'
import Footer from '../Footer/Footer'
import HamburgerMenu from '../HamburgerMenu/hamburgerMenu'
import { useEffect, useState } from 'react'
import WalletPopup from './WalletPopup'
import { getShortAddress } from '../../utils/'
import { convertMicroDenomToDenom } from '../../utils/conversion'
import { useWalletStore } from '../../store/walletStore'
import { toast } from 'react-toastify'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const {
    address: walletAddress,
    connect,
    disconnect,
    isFetchingData,
    isConnected,
    coins,
  } = useWalletStore((state) => state)

  const [showWalletPopup, set_showWalletPopup] = useState(false)

  useEffect(() => {
    // The user has been connected before, connect him automatically
    if (walletAddress !== '') {
      connect()
    }
  }, [])

  useEffect(() => {
    // const functionThatReturnPromise = () =>
    //   new Promise((resolve, reject) => setTimeout(reject, 3000))
    // toast
    //   .promise(functionThatReturnPromise, {
    //     pending: 'Promise is pending',
    //     success: 'Promise resolved 👌',
    //     error: 'Promise rejected 🤯',
    //   })
    //   .then(() => {
    //     console.log('done!')
    //   })
    //   .catch(() => {
    //     console.log('too bad :-(')
    //   })
  }, [isFetchingData])

  useEffect(() => {
    if (coins.length > 0) {
    }
  }, [coins])

  return (
    <div className="flex flex-col">
      <Head>
        <title>Cosmon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className=" max-w-auto relative z-10 -mb-[60px] flex w-full items-center justify-between px-5 pt-4">
        <div className="flex">
          <Link href="/">
            <a>
              <div className="relative h-[22px] w-[73px] lg:h-[40px] lg:w-[131px]">
                <Image priority={true} src={'/logo.png'} layout="fill" />
              </div>
            </a>
          </Link>

          <div className="ml-20 hidden items-center gap-x-[60px] lg:flex">
            <Link href="/">
              <a>About</a>
            </Link>
            <Link href="/buy-cosmon">
              <a>Buy Cosmon</a>
            </Link>
            <Link href="/my-assets">
              <a>My Assets</a>
            </Link>
          </div>
        </div>

        <div className="lg:hidden">
          <HamburgerMenu />
        </div>

        <div className="hidden items-center lg:flex">
          {isConnected() ? (
            <div className="flex items-center gap-x-5">
              <div className="relative">
                <Button
                  isLoading={isFetchingData}
                  className="relative max-h-[42px]"
                  size="small"
                  type="secondary"
                  onClick={() => set_showWalletPopup(true)}
                >
                  <span className="font-bold">
                    {convertMicroDenomToDenom(coins[0]?.amount)}{' '}
                    {coins[0]?.denom}
                  </span>
                </Button>
                {showWalletPopup && (
                  <WalletPopup
                    onClosePopup={() => set_showWalletPopup(false)}
                  />
                )}
              </div>

              <div className="flex items-center rounded-xl bg-[#1D1A47] pl-4 text-sm font-semibold text-white">
                ? ATOM
                <div
                  onClick={() => disconnect()}
                  className="ml-2 flex h-full cursor-pointer items-center rounded-xl border-[3px] border-[#A996FF] bg-white py-2 px-4 text-[#6A71BA]"
                >
                  {getShortAddress(walletAddress)}
                  <img className="ml-2 h-6 w-6" src="/avatar.png" alt="" />
                </div>
              </div>
            </div>
          ) : (
            <Button
              className="max-h-[42px]"
              type="secondary"
              isLoading={isFetchingData}
              onClick={() => connect()}
            >
              Connect wallet
            </Button>
          )}
        </div>
      </header>

      <main>{children}</main>
      <Footer />
    </div>
  )
}
