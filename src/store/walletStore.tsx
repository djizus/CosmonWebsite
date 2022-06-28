import create from 'zustand'
import { persist } from 'zustand/middleware'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClient } from '@cosmjs/stargate'
import { connectKeplr, makeClient, makeIbcClient } from '../services/keplr'
import { Coin } from '@cosmjs/amino/build/coins'
import { Scarcity } from '../../types/Scarcity'
import {
  executeBuyCosmon,
  executeCreditWalletWithFaucet,
  queryCosmonInfo,
  executeTransferNft,
  queryCheckAirdropEligibility,
  queryGetClaimData,
  executeClaimAirdrop,
  initIbc,
} from '../services/interaction'
import { toast } from 'react-toastify'
import { CosmonType } from '../../types/Cosmon'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import ErrorIcon from '/public/icons/error.svg'
import SuccessIcon from '/public/icons/success.svg'
import useSWR from 'swr'
import { chainFetcher } from '../services/fetcher'
import { convertDenomToMicroDenom } from '../utils/conversion'
import { useCosmonStore } from './cosmonStore'

const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const PUBLIC_IBC_CHAIN_ID = process.env.NEXT_PUBLIC_IBC_CHAIN_ID
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''
const PUBLIC_STAKING_IBC_DENOM = process.env.NEXT_PUBLIC_IBC_DENOM_RAW || ''

interface WalletState {
  address: string
  ibcAddress: string
  ibcDenom: string
  isFetchingData: boolean
  airdropData?: {
    isEligible: boolean
    address?: string
    max_claimable?: number
    num_already_claimed?: number
  }
  signingClient: SigningCosmWasmClient | null
  ibcSigningClient: SigningStargateClient | null
  maxClaimableToken?: number
  coins: Coin[]
  ibcCoins: Coin[]
  cosmons: CosmonType[]
  isConnected: boolean
  hasSubscribed: boolean
  showWithdrawDepositModal?: 'withdraw' | 'deposit'
  setCosmons: (cosmons: CosmonType[]) => void
  buyCosmon: (scarcity: Scarcity, price: string) => any
  transferAsset: (recipient: string, asset: CosmonType) => void
  connect: () => void
  disconnect: () => void
  setHasSubscribed: (hasSubscribed: boolean) => void
  fetchCoin: () => void
  addMoneyFromFaucet: () => void
  fetchCosmons: () => void
  fetchWalletData: () => void
  initIbc: () => void
  getAirdropData: () => void
  claimAirdrop: () => any
  resetClaimData: () => void
  setShowWithdrawDepositModal: (type?: 'withdraw' | 'deposit') => void
  // checkIfEligibleForAirdrop: (reset?: boolean) => Promise<void>
}

const useWalletStore = create<WalletState>(
  persist(
    (set, get) => ({
      coins: [],
      ibcCoins: [],
      ibcDenom: process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN || '',
      cosmons: [],
      address: '',
      ibcAddress: '',
      isFetchingData: false,
      signingClient: null,
      ibcSigningClient: null,

      isConnected: false,
      hasSubscribed: false,
      isEligibleForAirdrop: null,
      setHasSubscribed: (hasSubscribed) => {
        set({
          hasSubscribed: hasSubscribed,
        })
      },
      connect: async () => {
        set({
          isFetchingData: true,
        })

        try {
          await connectKeplr()

          // enable website to access kepler
          await (window as any).keplr.enable(PUBLIC_CHAIN_ID)
          await (window as any).keplr.enable(PUBLIC_IBC_CHAIN_ID)

          // get offline signer for signing txs
          const offlineSigner = await (window as any).getOfflineSignerAuto(
            PUBLIC_CHAIN_ID
          )
          const ibcOfflineSigner = await (window as any).getOfflineSignerAuto(
            PUBLIC_IBC_CHAIN_ID
          )
          const client = await makeClient(offlineSigner)
          const ibcClient = await makeIbcClient(ibcOfflineSigner)

          set({
            signingClient: client,
          })

          set({
            ibcSigningClient: ibcClient,
          })

          // get user address
          console.log(
            'await offlineSigner.getAccounts()',
            await offlineSigner.getAccounts()
          )
          const [{ address }] = await offlineSigner.getAccounts()
          const ibcAddress = (await ibcOfflineSigner.getAccounts())[0].address

          set({
            address: address,
            ibcAddress,
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
      initIbc: async () => {
        const { signingClient, fetchCosmons, address, getAirdropData } = get()
        if (signingClient && address) {
          const response = await toast
            .promise(initIbc(signingClient, address), {
              pending: {
                render() {
                  return (
                    <ToastContainer type="pending">
                      {`IBC transfer initalized`}
                    </ToastContainer>
                  )
                },
              },
              success: {
                render() {
                  return (
                    <ToastContainer type={'success'}>
                      IBC transfer done successfully
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
            .then(async ({ token }: any) => {})
          // return response
        }
      },
      fetchWalletData: async () => {
        const { signingClient } = get()
        set({
          isFetchingData: true,
        })
        const { fetchCosmons, fetchCoin } = get()
        await fetchCosmons()
        await fetchCoin()

        set({
          // maxClaimableToken: maxClaimableToken,
          isFetchingData: false,
        })
      },

      fetchCoin: async () => {
        const { signingClient, address, coins, ibcCoins } = get()
        if (signingClient && address) {
          try {
            const mainCoin = await signingClient.getBalance(
              address,
              PUBLIC_STAKING_DENOM
            )
            const atomCoin = await signingClient.getBalance(
              address,
              PUBLIC_STAKING_IBC_DENOM
            )
            let newCoins = coins.filter(
              (coin) =>
                coin.denom !== PUBLIC_STAKING_DENOM &&
                coin.denom !== PUBLIC_STAKING_IBC_DENOM
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
            const tokens: string[] = []
            let start_after = undefined
            while (true) {
              let response = await signingClient.queryContractSmart(
                process.env.NEXT_PUBLIC_NFT_CONTRACT || '',
                {
                  tokens: {
                    owner: address,
                    start_after,
                    limit: 10,
                  },
                }
              )

              for (const token of response.tokens) {
                tokens.push(token)
              }

              if (response.tokens.length < 10) {
                break
              }

              start_after = tokens[tokens.length - 1]
            }

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
      buyCosmon: async (scarcity, price) => {
        const { signingClient, fetchCosmons, address } = get()
        if (signingClient && address) {
          const response = await toast
            .promise(
              executeBuyCosmon(signingClient, price, address, scarcity),
              {
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
                      <ToastContainer type="error">
                        {data.message}
                      </ToastContainer>
                    )
                  },
                  icon: ErrorIcon,
                },
              }
            )
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

      resetClaimData: async () => {
        set({
          airdropData: undefined,
        })
      },
      getAirdropData: async () => {
        const { signingClient, address, airdropData } = get()
        const toastId = toast.loading(
          airdropData
            ? 'Refreshing airdrop data, please wait..'
            : 'Fetching airdrop data, please wait..'
        )

        const isEligible =
          signingClient &&
          (await queryCheckAirdropEligibility(signingClient, address))

        if (!isEligible) {
          set({
            airdropData: {
              isEligible: false,
            },
          })
        } else {
          const claimData =
            signingClient && (await queryGetClaimData(signingClient, address))
          console.log('claimData', claimData)
          set({
            airdropData: {
              isEligible: true,
              ...claimData,
            },
          })
        }
        toast.dismiss(toastId)
      },
      claimAirdrop: async () => {
        const { signingClient, fetchCosmons, address, getAirdropData } = get()
        if (signingClient && address) {
          console.log('here')
          const response = await toast
            .promise(executeClaimAirdrop(signingClient, address), {
              pending: {
                render() {
                  return (
                    <ToastContainer type="pending">
                      {`Claiming cosmon airdrop`}
                    </ToastContainer>
                  )
                },
              },
              success: {
                render() {
                  return (
                    <ToastContainer type={'success'}>
                      Cosmon claimed successfully,
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
            .then(async ({ token }: any) => {
              await getAirdropData()
              fetchCosmons()
              return token
            })
          return response
        }
      },
      setShowWithdrawDepositModal: (value?: 'withdraw' | 'deposit') => {
        set({
          showWithdrawDepositModal: value,
        })
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
