import create from 'zustand'
import { persist } from 'zustand/middleware'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { connectKeplr, makeClient } from '../services/keplr'
import { Coin } from '@cosmjs/amino/build/coins'
import { FaucetClient } from '@cosmjs/faucet-client'
import { Scarcity } from '../../types/Scarcity'
import {
  executeBuyCosmon,
  executeCreditWalletWithFaucet,
  queryCosmonPrice,
} from '../services/interaction'
import { toast } from 'react-toastify'

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
  isConnected: () => boolean
  buyCosmon: (scarcity: Scarcity) => void
  connect: () => void
  disconnect: () => void
  fetchCoin: () => void
  addMoneyFromFaucet: () => void
  refetchMyTokens: () => void
  getCosmonPrice: (scarcity: Scarcity) => void
}

const useWalletStore = create<WalletState>(
  persist(
    (set, get) => ({
      coins: [],
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

          await get().refetchMyTokens()
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
              success: `Wallet credited successfully 👌`,
              error: {
                render({ data }) {
                  return data
                },
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
          const coin = await signingClient.getBalance(
            address,
            PUBLIC_STAKING_DENOM
          )
          let newCoins = coins.filter(
            (coin) => coin.denom !== PUBLIC_STAKING_DENOM
          )
          newCoins.push(coin)
          set({
            coins: newCoins,
          })
        }
      },
      refetchMyTokens: async () => {
        const { signingClient, address } = get()
        if (signingClient && address) {
          const my_tokens = await signingClient.queryContractSmart(
            process.env.NEXT_PUBLIC_NFT_CONTRACT || '',
            { tokens: { owner: address } }
          )
          console.log('my tokens', JSON.stringify(my_tokens))
        }
      },
      buyCosmon: async (scarcity) => {
        const { signingClient, refetchMyTokens, address } = get()
        if (signingClient && address) {
          toast
            .promise(executeBuyCosmon(signingClient, address, scarcity), {
              pending: `Buying ${scarcity} cosmon`,
              success: `${scarcity} bought successfully 👌`,
              error: {
                render({ data }) {
                  return data
                },
              },
            })
            .then(() => {
              refetchMyTokens()
            })
        }
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
