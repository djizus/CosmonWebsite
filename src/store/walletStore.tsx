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
  executeTransferNft,
  queryGetMaxClaimableToken,
} from '../services/interaction'
import { toast } from 'react-toastify'
import { CosmonType } from '../../types/Cosmon'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import ErrorIcon from '/public/icons/error.svg'
import SuccessIcon from '/public/icons/success.svg'
import useSWR from 'swr'
import { chainFetcher } from '../services/fetcher'

const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const PUBLIC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''
const PUBLIC_SELL_CONTRACT = process.env.NEXT_PUBLIC_SELL_CONTRACT || ''

interface WalletState {
  address: string
  isFetchingData: boolean
  signingClient: SigningCosmWasmClient | null
  maxClaimableToken?: number
  coins: Coin[]
  cosmons: CosmonType[]
  isConnected: boolean
  setCosmons: (cosmons: CosmonType[]) => void
  buyCosmon: (scarcity: Scarcity) => any
  transferAsset: (recipient: string, asset: CosmonType) => void
  connect: () => void
  disconnect: () => void
  fetchCoin: () => void
  addMoneyFromFaucet: () => void
  fetchCosmons: () => void
  fetchWalletData: () => void
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
      isConnected: false,
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
            isConnected: true,
          })
          await get().fetchWalletData()
        } catch (error: any) {
          console.error('error while connecting', error)
        } finally {
          set({
            isFetchingData: false,
          })
        }
      },
      setCosmons: (cosmons) => {
        set({
          cosmons: cosmons,
        })
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
      fetchWalletData: async () => {
        const { signingClient } = get()
        let maxClaimableToken
        set({
          isFetchingData: true,
        })
        const { fetchCosmons, fetchCoin } = get()
        await fetchCosmons()
        await fetchCoin()
        if (signingClient) {
          maxClaimableToken = await queryGetMaxClaimableToken(signingClient)
        }

        set({
          maxClaimableToken: maxClaimableToken,
          isFetchingData: false,
        })
      },

      fetchCoin: async () => {
        const { signingClient, address, coins } = get()
        if (signingClient && address) {
          try {
            const mainCoin = await signingClient.getBalance(
              address,
              PUBLIC_STAKING_DENOM
            )
            const atomCoin = await signingClient.getBalance(address, 'ATOM')
            let newCoins = coins.filter(
              (coin) => coin.denom !== PUBLIC_STAKING_DENOM
            )
            newCoins.push(mainCoin, atomCoin)
            set({
              coins: newCoins,
            })
          } catch (e) {
            console.error('Error while fetching coin', e)
          }
        }
      },
      fetchCosmons: async () => {
        set({
          isFetchingData: true,
        })
        const { signingClient, address } = get()
        if (signingClient && address) {
          try {
            const { tokens } = await signingClient.queryContractSmart(
              process.env.NEXT_PUBLIC_NFT_CONTRACT || '',
              {
                tokens: {
                  owner: address,
                  limit: 5000,
                },
              }
            )
            // const tokens: any = []

            // getting cosmon details
            const myCosmons: CosmonType[] = await Promise.all(
              tokens.map(async (token: string) => {
                const cosmon = await queryCosmonInfo(signingClient, token)
                return {
                  id: token,
                  data: cosmon,
                }
              })
            )
            // console.log('myCosmons', myCosmons)
            set({
              cosmons: myCosmons.map(
                (cosmon) =>
                  get().cosmons.find((c) => c.id === cosmon.id) || cosmon
              ),
            })
          } catch (e) {
            console.error('Error while fetching cosmons', e)
          } finally {
            set({
              isFetchingData: false,
            })
          }
        }
      },
      buyCosmon: async (scarcity) => {
        const { signingClient, fetchCosmons, address } = get()
        if (signingClient && address) {
          const response = await toast
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
            .then(({ token }: any) => {
              fetchCosmons()
              return token
            })
          return response
        }
      },
      transferAsset: async (recipient: string, asset: CosmonType) => {
        const { signingClient, fetchCosmons, address } = get()
        if (signingClient && address) {
          toast
            .promise(
              executeTransferNft(signingClient, address, recipient, asset.id),
              {
                pending: {
                  render() {
                    return (
                      <ToastContainer type="pending">
                        {`Transferring ${asset.data.extension.name}`}
                      </ToastContainer>
                    )
                  },
                },
                success: {
                  render() {
                    return (
                      <ToastContainer type={'success'}>
                        {`${asset.data.extension.name}`} transferred
                        successfully,
                      </ToastContainer>
                    )
                  },
                  icon: SuccessIcon,
                },

                error: {
                  render({ data }: any) {
                    return (
                      <ToastContainer type="error">
                        {data.message}
                      </ToastContainer>
                    )
                  },
                  icon: ErrorIcon,
                },
              }
            )
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
          // if (scarcity === 'Epic') {
          //   return 0
          // }
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
          isConnected: false,
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
