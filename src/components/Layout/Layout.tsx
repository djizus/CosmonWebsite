import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button/Button'
import Footer from '../Footer/Footer'
import HamburgerMenu from '../HamburgerMenu/hamburgerMenu'
import { useEffect, useState } from 'react'
import WalletPopup from './WalletPopup'
import { getShortAddress } from '../../utils/'
import { useWalletStore } from '../../store/walletStore'
import { getAmountFromDenom } from '../../utils/index'
import { chainFetcher } from '../../services/fetcher'
import useSWR from 'swr'

import DisconnectOrCopyPopup from './DisconnectOrCopyPopup'
import { useCosmonStore } from '../../store/cosmonStore'
import WithdrawDepositModal from '../Modal/WithdrawDepositModal'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const {
    address: walletAddress,
    connect,
    disconnect,
    isFetchingData,
    fetchWalletData,
    cosmons,
    isConnected,
    ibcDenom,
    coins,
    showWithdrawDepositModal,
    setShowWithdrawDepositModal,
  } = useWalletStore((state) => state)

  const { getWhitelistData } = useCosmonStore((state) => state)

  // const { data: tokens, error } = useSWR(
  //   {
  //     type: 'query',
  //     contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT,
  //     payload: {
  //       tokens: {
  //         owner: walletAddress,
  //         limit: 5000,
  //       },
  //     },
  //   },
  //   chainFetcher
  // )

  // console.log('data', tokens)
  // console.log('error', error)

  const [showWalletPopup, set_showWalletPopup] = useState(false)
  const [showDisconnectOrCopyPopup, set_showDisconnectOrCopyPopup] =
    useState(false)
  // const [refreshWalletDataInterval, set_refreshWalletDataInterval] = useState<
  //   number | null
  // >()

  // useEffect(() => {}, [tokens])

  const handleSwitchAccount = async () => {
    // setTimeout(() => {
    // await disconnect()
    await connect()
    await fetchWalletData()
    await getWhitelistData()
    // }, 100)
  }

  useEffect(() => {
    // The user has been connected before, connect him automatically
    if (walletAddress !== '') {
      setTimeout(() => {
        connect()
      }, 250)
    }
    window.addEventListener('keplr_keystorechange', handleSwitchAccount)

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleSwitchAccount)
    }
  }, [])

  useEffect(() => {
    if (coins.length > 0) {
      // console.log('coins', coins)
    }
  }, [coins])

  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      console.log('Re-fetching data...')
      fetchWalletData()
    }, 8000)
    return () => clearInterval(refreshInterval)
  }, [isConnected])

  return (
    <div className="flex flex-col">
      <Head>
        <title>Cosmon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showWithdrawDepositModal && (
        <WithdrawDepositModal
          onCloseModal={() => setShowWithdrawDepositModal()}
        />
      )}

      <header className=" max-w-auto relative z-10 -mb-[60px] flex w-full items-center justify-between px-5 pt-4 lg:pt-6">
        <div className="flex">
          <Link href="/">
            <a>
              <div className="relative h-[22px] w-[73px] lg:h-[40px] lg:w-[131px]">
                <Image priority={true} src={'../logo.png'} layout="fill" />
              </div>
            </a>
          </Link>
          {/* MVP - Remove navigation */}

          <div className="ml-20 hidden items-center gap-x-[60px] lg:flex">
            <Link href="/buy-cosmon">
              <a>Buy Cosmon</a>
            </Link>
            <Link href="/my-assets">
              <a>
                My Assets
                {cosmons.length > 0 && ` (${cosmons.length})`}
              </a>
            </Link>
          </div>
        </div>

        {/* <div className="lg:hidden">
          <HamburgerMenu />
        </div> */}

        <div className="relative hidden items-center lg:flex">
          {isConnected ? (
            <div className="flex items-center gap-x-5">
              <div className="relative">
                <Button
                  isLoading={isFetchingData}
                  className="relative max-h-[42px]"
                  size="small"
                  type="secondary"
                  onClick={() => set_showWalletPopup(true)}
                >
                  <span className="font-bold uppercase">
                    {getAmountFromDenom(
                      process.env.NEXT_PUBLIC_STAKING_DENOM || '',
                      coins
                    )}
                    {' ' + process.env.NEXT_PUBLIC_DENOM}
                  </span>
                </Button>
                {showWalletPopup && (
                  <WalletPopup
                    onClosePopup={() => set_showWalletPopup(false)}
                  />
                )}
              </div>

              <div className="flex items-center rounded-xl bg-[#1D1A47] pl-4 text-sm font-semibold text-white">
                {getAmountFromDenom(
                  process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '',
                  coins
                )}

                <div className="ml-1 uppercase"> {ibcDenom}</div>
                <div
                  onClick={() =>
                    set_showDisconnectOrCopyPopup(!showDisconnectOrCopyPopup)
                  }
                  className="ml-2 flex h-full cursor-pointer items-center rounded-xl border border-[#9FA4DD] py-2 px-4 text-white"
                >
                  {getShortAddress(walletAddress)}
                  <img className="ml-2 h-6 w-6" src="/avatar.png" alt="" />
                </div>
                {showDisconnectOrCopyPopup && (
                  <DisconnectOrCopyPopup
                    onClosePopup={() => set_showDisconnectOrCopyPopup(false)}
                  />
                )}
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

      <main className="-mt-4 lg:-mt-6">{children}</main>
      <Footer />
    </div>
  )
}
