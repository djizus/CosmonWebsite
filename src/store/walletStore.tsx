import create from 'zustand'
import { persist } from 'zustand/middleware'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { connectKeplr, makeClient } from '../services/keplr'
import { Coin } from '@cosmjs/amino/build/coins'
import { Scarcity } from '../../types/Scarcity'
import {
  executeBuyCosmon,
  executeCreditWalletWithFaucet,
  queryCosmonInfo,
  queryCosmonPrice,
  queryCosmonAvailableByScarcity,
} from '../services/interaction'
import { toast } from 'react-toastify'
import { CosmonType } from '../../types/Cosmon'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import ErrorIcon from '/public/icons/error.svg'
import SuccessIcon from '/public/icons/success.svg'

const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const PUBLIC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''
const PUBLIC_SELL_CONTRACT = process.env.NEXT_PUBLIC_SELL_CONTRACT || ''

interface WalletState {
  address: string
  isFetchingData: boolean
  signingClient: SigningCosmWasmClient | null
  error: any
  coins: Coin[]
  cosmons: CosmonType[]
  isConnected: () => boolean
  buyCosmon: (scarcity: Scarcity) => void
  connect: () => void
  disconnect: () => void
  fetchCoin: () => void
  addMoneyFromFaucet: () => void
  fetchCosmons: () => void

  getCosmonPrice: (scarcity: Scarcity) => void
  getCosmonScarcityAvailable: (scarcity: Scarcity) => Promise<number>
}

const useWalletStore = create<WalletState>(
  persist(
    (set, get) => ({
      coins: [],
      cosmons: [],
      address: '',
      isFetchingData: false,
      signingClient: null,
      error: null,
      isConnected: () => {
        return !!get().address && !!get().signingClient
      },
      connect: async () => {
        set({
          isFetchingData: true,
        })

        try {
          await connectKeplr()

          // enable website to access kepler
          await (window as any).keplr.enable(PUBLIC_CHAIN_ID)

          // get offline signer for signing txs
          const offlineSigner = await (window as any).getOfflineSigner(
            PUBLIC_CHAIN_ID
          )
          const client = await makeClient(offlineSigner)

          set({
            signingClient: client,
          })

          // get user address
          const [{ address }] = await offlineSigner.getAccounts()

          set({
            address: address,
          })
          await get().fetchCosmons()
          await get().fetchCoin()
        } catch (error: any) {
          console.error('error while connecting', error)
        } finally {
          set({
            isFetchingData: false,
          })
        }
      },
      addMoneyFromFaucet: async () => {
        set({
          isFetchingData: true,
        })

        const { signingClient, address, fetchCoin } = get()

        if (signingClient && address) {
          toast
            .promise(executeCreditWalletWithFaucet(address), {
              pending: `Adding from faucet`,
              success: {
                render() {
                  return (
                    <ToastContainer type="success">
                      Wallet credited successfully
                    </ToastContainer>
                  )
                },
                icon: SuccessIcon,
              },
              error: {
                render({ data }: any) {
                  console.log('my data', data)
                  return (
                    <ToastContainer type="error">{data.message}</ToastContainer>
                  )
                },
                icon: ErrorIcon,
              },
            })
            .then(() => {
              fetchCoin()
            })
        }
        set({
          isFetchingData: false,
        })
      },

      fetchCoin: async () => {
        const { signingClient, address, coins } = get()
        if (signingClient && address) {
          const mainCoin = await signingClient.getBalance(
            address,
            PUBLIC_STAKING_DENOM
          )
          const ustCoin = await signingClient.getBalance(address, 'UST')
          let newCoins = coins.filter(
            (coin) => coin.denom !== PUBLIC_STAKING_DENOM
          )
          newCoins.push(mainCoin, ustCoin)
          set({
            coins: newCoins,
          })
        }
      },
      fetchCosmons: async () => {
        set({
          isFetchingData: true,
        })
        const { signingClient, address } = get()
        if (signingClient && address) {
          const { tokens } = await signingClient.queryContractSmart(
            process.env.NEXT_PUBLIC_NFT_CONTRACT || '',
            { tokens: { owner: address } }
          )

          // getting cosmon details
          const myCosmons: CosmonType[] = await Promise.all(
            tokens.map(async (token: number) => {
              const cosmon = await queryCosmonInfo(signingClient, token)
              return {
                id: token,
                data: cosmon,
              }
            })
          )
          set({
            cosmons: myCosmons.map(
              (cosmon) =>
                get().cosmons.find((c) => c.id === cosmon.id) || cosmon
            ),
          })
          console.log('my cosmons', myCosmons)
          set({
            isFetchingData: false,
          })
        }
      },
      buyCosmon: async (scarcity) => {
        const { signingClient, fetchCosmons, address } = get()
        if (signingClient && address) {
          toast
            .promise(executeBuyCosmon(signingClient, address, scarcity), {
              pending: {
                render() {
                  return (
                    <ToastContainer type="pending">
                      {`Buying ${scarcity.toLowerCase()} cosmon`}
                    </ToastContainer>
                  )
                },
              },
              success: {
                render() {
                  return (
                    <ToastContainer type={'success'}>
                      {scarcity} bought successfully,
                    </ToastContainer>
                  )
                },
                icon: SuccessIcon,
              },

              error: {
                render({ data }: any) {
                  return (
                    <ToastContainer type="error">{data.message}</ToastContainer>
                  )
                },
                icon: ErrorIcon,
              },
            })
            .then(() => {
              fetchCosmons()
            })
        }
      },
      getCosmonScarcityAvailable: async (scarcity): Promise<number> => {
        const { signingClient } = get()
        if (signingClient) {
          const result = await queryCosmonAvailableByScarcity(
            signingClient,
            scarcity
          )
          return result?.count || 0
        }
        return 0
      },
      getCosmonPrice: async (scarcity) => {
        const { signingClient } = get()
        signingClient && (await queryCosmonPrice(signingClient, scarcity))
      },
      disconnect: () => {
        get().signingClient?.disconnect()
        set({
          address: '',
          signingClient: null,
        })
      },
    }),
    {
      name: 'wallet',
      partialize: (state) => ({ address: state.address }),
    }
  )
)

export { useWalletStore }
