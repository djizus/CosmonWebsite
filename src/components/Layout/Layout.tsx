import Head from 'next/head'
import Link from 'next/link'
import Button from '../Button/Button'
import Footer from '../Footer/Footer'
import { useEffect, useState } from 'react'
import WalletPopup from './WalletPopup'
import { getShortAddress } from '../../utils/'
import { useWalletStore } from '../../store/walletStore'
import { getAmountFromDenom } from '../../utils/index'
import DisconnectOrCopyPopup from './DisconnectOrCopyPopup'
import { useCosmonStore } from '../../store/cosmonStore'
import WithdrawDepositModal from '../Modal/WithdrawDepositModal'
import { AnimatePresence } from 'framer-motion'
import BuyXKIModal from '@components/Modal/BuyXKIModal'
import IBCCoinBreakdownPopup from './IBCCoinBreakdownPopup'
import { isConnectionTypeHandled, wasPreviouslyConnected } from '@utils/connection'
import {
  handleChangeAccount as handleChangeCosmostationAccount,
  stopListenForChangeAccount as stopListenForChangeCosmostationAccount,
} from '@services/connection/cosmostation'
import {
  handleChangeAccount as handleChangeKeplrAccount,
  stopListenForChangeAccount as stopListenForChangeKeplrAccount,
} from '@services/connection/keplr'
import ButtonConnectWallet from '@components/Button/ButtonConnectWallet'
import { NavigationMenu } from '@components/Mobile'
import { useRouter } from 'next/router'
import HamburgerMenu from '@components/HamburgerMenu/hamburgerMenu'
import { useDeckStore } from '@store/deckStore'
import { CONNECTION_TYPE } from 'types/Connection'
import { IS_MARKETPLACE_ACTIVE } from '@utils/constants'

type LayoutProps = {
  children: React.ReactNode
}

const ARENA_IS_ACTIVE = Boolean(process.env.NEXT_PUBLIC_ARENA_IS_ACTIVE)

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()

  const {
    address: walletAddress,
    connect,
    isFetchingData,
    fetchWalletData,
    cosmons,
    cosmonsId,
    isConnected,
    ibcDenom,
    coins,
    showWithdrawDepositModal,
    setShowWithdrawDepositModal,
    cosmosConnectionProvider,
  } = useWalletStore()

  const { getWhitelistData } = useCosmonStore()
  const { fetchPersonalityAffinities } = useDeckStore()

  const [isHamburgerActive, setIsHamburgerActive] = useState(false)

  const [showWalletPopup, set_showWalletPopup] = useState(false)
  const [showATOMBreakdownPopup, set_showATOMBreakdownPopup] = useState(false)
  const [showNoXKIModal, setShowNoXKIModal] = useState(false)
  const [showDisconnectOrCopyPopup, set_showDisconnectOrCopyPopup] = useState(false)

  useEffect(() => {
    // The user has been connected before, connect him automatically
    const connectedAuth = wasPreviouslyConnected()
    if (connectedAuth?.address) {
      if (isConnectionTypeHandled(connectedAuth.type)) {
        connect(connectedAuth.type)
      }
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      fetchWalletData()
      getWhitelistData()
      fetchPersonalityAffinities()
    }
  }, [isConnected])

  // handle change wallet account
  useEffect(() => {
    let event: any = null
    if (wasPreviouslyConnected()?.address && isConnected) {
      switch (wasPreviouslyConnected()?.type) {
        case CONNECTION_TYPE.COSMOSTATION: {
          if (cosmosConnectionProvider) {
            event = handleChangeCosmostationAccount(cosmosConnectionProvider)
          }
          break
        }

        case CONNECTION_TYPE.KEPLR:
          handleChangeKeplrAccount()
          break
        default:
          break
      }
    }
    return () => {
      if (wasPreviouslyConnected()?.address && isConnected) {
        switch (wasPreviouslyConnected()?.type) {
          case CONNECTION_TYPE.COSMOSTATION: {
            if (cosmosConnectionProvider && event) {
              stopListenForChangeCosmostationAccount(cosmosConnectionProvider, event)
            }
            break
          }

          case CONNECTION_TYPE.KEPLR:
            stopListenForChangeKeplrAccount()
            break
          default:
            break
        }
      }
    }
  }, [wasPreviouslyConnected()?.address, cosmosConnectionProvider, isConnected])

  useEffect(() => {
    if (isHamburgerActive) {
      // close navigation when route changes
      setIsHamburgerActive(!isHamburgerActive)
    }
  }, [router.asPath])

  useEffect(() => {
    if (coins.length > 0) {
      const availableXki = getAmountFromDenom(process.env.NEXT_PUBLIC_STAKING_DENOM || '', coins)
      if (availableXki <= 0) {
        setShowNoXKIModal(true)
      }
    }
  }, [coins])

  return (
    <div className="flex flex-col">
      <Head>
        <title>Cosmon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showWithdrawDepositModal && (
        <WithdrawDepositModal onCloseModal={() => setShowWithdrawDepositModal()} />
      )}

      <header className=" max-w-auto relative z-10 -mb-[60px] flex w-full items-center justify-between px-5 pt-4 lg:pt-6">
        <div className="flex">
          <Link href="/">
            <a>
              <div className="relative z-[100] h-[22px] w-[73px] lg:h-[40px] lg:w-[131px]">
                <img src={'/logo.png'} />
              </div>
            </a>
          </Link>
          {/* MVP - Remove navigation */}

          <div className="ml-20 hidden items-center gap-x-[25px] lg:flex">
            <Link href="/buy-cosmon">
              <a>Buy Cosmon</a>
            </Link>
            {IS_MARKETPLACE_ACTIVE ? (
              <Link href="/marketplace">
                <a>Marketplace</a>
              </Link>
            ) : null}
            <Link href="https://docs.cosmon.ki/">
              <a target="_blank">Documentation</a>
            </Link>
            <Link href="/my-assets">
              <a>
                My Assets
                {cosmonsId.length > 0 && ` (${cosmonsId.length})`}
              </a>
            </Link>
            {ARENA_IS_ACTIVE ? (
              <Link href="/arena">
                <a>Arena</a>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          {isConnected ? (
            <>
              <div
                onClick={(e) => {
                  set_showDisconnectOrCopyPopup(!showDisconnectOrCopyPopup)
                }}
                className="flex h-full cursor-pointer items-center rounded-xl border border-[#9FA4DD] py-2 px-4 text-white"
              >
                {getShortAddress(walletAddress)}
                <img className="ml-2 h-6 w-6" src="/avatar.png" alt="" />
              </div>
              <>
                {showDisconnectOrCopyPopup && (
                  <DisconnectOrCopyPopup
                    onClosePopup={() => set_showDisconnectOrCopyPopup(false)}
                  />
                )}
              </>
            </>
          ) : (
            <ButtonConnectWallet buttonProps={{ type: 'secondary' }} />
          )}
          <HamburgerMenu isActive={isHamburgerActive} onToggleMenu={setIsHamburgerActive} />
          <AnimatePresence>{isHamburgerActive ? <NavigationMenu /> : null}</AnimatePresence>
        </div>

        <div className="relative hidden items-center lg:flex">
          {isConnected ? (
            <div className="flex items-center gap-x-5">
              <div>
                <a href="https://app.osmosis.zone/?from=ATOM&to=XKI" target="_blank">
                  <Button type="primary" size="small" className="relative max-h-[42px]">
                    Buy XKI
                  </Button>
                </a>
              </div>

              <div className="relative">
                <Button
                  isLoading={isFetchingData}
                  className="relative max-h-[42px]"
                  size="small"
                  type="secondary"
                  onClick={() => set_showWalletPopup(true)}
                >
                  <span className="font-bold uppercase">
                    {getAmountFromDenom(process.env.NEXT_PUBLIC_STAKING_DENOM || '', coins)}
                    {' ' + process.env.NEXT_PUBLIC_DENOM}
                  </span>
                </Button>
                {showWalletPopup && <WalletPopup onClosePopup={() => set_showWalletPopup(false)} />}
              </div>

              <div className="flex cursor-pointer items-center rounded-xl bg-[#1D1A47] text-sm font-semibold text-white">
                <span
                  className="cursor-pointer py-[10px] px-[15px] uppercase"
                  onClick={() => {
                    set_showATOMBreakdownPopup(true)
                  }}
                >
                  {getAmountFromDenom(process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '', coins)}{' '}
                  {ibcDenom}
                </span>
                <div
                  onClick={(e) => {
                    set_showDisconnectOrCopyPopup(!showDisconnectOrCopyPopup)
                  }}
                  className="flex h-full cursor-pointer items-center rounded-xl border border-[#9FA4DD] py-2 px-4 text-white"
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
              {showATOMBreakdownPopup && (
                <IBCCoinBreakdownPopup onClosePopup={() => set_showATOMBreakdownPopup(false)} />
              )}
            </div>
          ) : (
            <ButtonConnectWallet buttonProps={{ type: 'secondary' }} />
          )}
        </div>
      </header>

      <AnimatePresence>
        {showNoXKIModal ? (
          <BuyXKIModal
            hasCloseButton={false}
            onCloseModal={() => {
              setShowNoXKIModal(false)
            }}
          />
        ) : null}
      </AnimatePresence>

      <main className="-mt-4 lg:-mt-6">{children}</main>
      <Footer />
    </div>
  )
}
