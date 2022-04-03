import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button/Button'
import Footer from '../Footer/Footer'
import HamburgerMenu from '../HamburgerMenu/hamburgerMenu'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { useState } from 'react'
import WalletPopup from './WalletPopup'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const isConnected = useStoreState((state) => state.isConnected)
  const walletAction = useStoreActions((thunk) => thunk.walletAction)

  const [showWalletPopup, set_showWalletPopup] = useState(false)
  return (
    <div className="flex flex-col">
      <Head>
        <title>Cosmon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className=" relative z-10 mx-auto -mb-[60px] flex w-full max-w-[1380px] items-center justify-between px-5 pt-4">
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
          {isConnected ? (
            <div className="flex items-center gap-x-5">
              <div className="relative">
                <Button
                  className="relative max-h-[42px]"
                  size="small"
                  type="secondary"
                  onClick={() =>
                    // walletAction({
                    //   action: 'disconnect',
                    // })
                    set_showWalletPopup(true)
                  }
                >
                  <span className="font-bold">212.72 XKI</span>
                </Button>
                {showWalletPopup && (
                  <WalletPopup
                    onClosePopup={() => set_showWalletPopup(false)}
                  />
                )}
              </div>

              <div className="flex items-center rounded-xl bg-[#1D1A47] pl-4 text-sm font-semibold text-white">
                14.23 ATOM
                <div
                  onClick={() =>
                    walletAction({
                      action: 'disconnect',
                    })
                  }
                  className="ml-2 flex h-full cursor-pointer items-center rounded-xl border-[3px] border-[#A996FF] bg-white py-2 px-4 text-[#6A71BA]"
                >
                  Cosmos05...e96e
                  <img className="ml-2 h-6 w-6" src="/avatar.png" alt="" />
                </div>
              </div>
            </div>
          ) : (
            <Button
              className="max-h-[42px]"
              type="secondary"
              onClick={() =>
                walletAction({
                  action: 'connect',
                })
              }
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
