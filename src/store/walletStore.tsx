import create from 'zustand'
import { persist } from 'zustand/middleware'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClient } from '@cosmjs/stargate'
import {
  makeClient,
  makeIbcClient,
  makeStargateClient,
  makeStargateClientUnsigned,
} from '../services/connection/cosmos-clients'
import { Coin } from '@cosmjs/amino/build/coins'
import {
  executeBuyCosmon,
  executeCreditWalletWithFaucet,
  queryCosmonInfo,
  executeTransferNft,
  queryCheckAirdropEligibility,
  queryGetClaimData,
  executeClaimAirdrop,
  initIbc,
  fetch_tokens,
} from '@services/interaction'
import { toast } from 'react-toastify'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import ErrorIcon from '/public/icons/error.svg'
import SuccessIcon from '/public/icons/success.svg'
import { useCosmonStore } from './cosmonStore'
import { useRewardStore } from './rewardStore'
import { sortCosmonsByScarcity } from '@utils/cosmon'
import { NFTId, CosmonType, Scarcity } from 'types'
import { XPRegistryService } from '@services/xp-registry'
import { DeckService } from '@services/deck'
import { CustomIndexedTx, IndexedTxMethodType } from 'types/IndexedTxMethodType'
import { connectKeplr } from '@services/connection/keplr'
import { connectWithCosmostation } from '@services/connection/cosmostation'
import { CONNECTION_TYPE, CosmosConnectionProvider } from 'types/Connection'
import { removeLastConnection, saveLastConnection, wasPreviouslyConnected } from '@utils/connection'

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''
const PUBLIC_STAKING_IBC_DENOM = process.env.NEXT_PUBLIC_IBC_DENOM_RAW || ''
const PUBLIC_STAKING_IBC_DENOM_ON_CHAIN = process.env.NEXT_PUBLIC_IBC_DENOM || ''
const SEARCH_BLOCKCHAIN_HEIGHT_STEPS =
  Number(process.env.NEXT_PUBLIC_SEARCH_BLOCKCHAIN_HEIGHT_STEPS) || 500

interface WalletState {
  address: string
  ibcAddress: string
  ibcDenom: string
  isFetchingData: boolean
  isFetchingCosmons: boolean
  airdropData?: {
    isEligible: boolean
    address?: string
    max_claimable?: number
    num_already_claimed?: number
  }
  signingClient: SigningCosmWasmClient | null
  stargateSigningClient: SigningStargateClient | null
  ibcSigningClient: SigningStargateClient | null
  maxClaimableToken?: number
  coins: Coin[]
  ibcCoins: Coin[]
  cosmons: CosmonType[]
  isCurrentlyIbcTransferring: boolean
  isConnected: boolean
  cosmosConnectionProvider?: CosmosConnectionProvider | null
  hasSubscribed: boolean
  showWithdrawDepositModal?: 'withdraw' | 'deposit'
  connect: (type?: CONNECTION_TYPE) => void
  setCosmons: (cosmons: CosmonType[]) => void
  buyCosmon: (scarcity: Scarcity, price: string) => any
  transferAsset: (recipient: string, asset: CosmonType) => void
  disconnect: () => void
  setHasSubscribed: (hasSubscribed: boolean) => void
  fetchCoin: () => void
  addMoneyFromFaucet: () => void
  fetchCosmons: () => void
  updateCosmonsAreInDeck: () => void
  markCosmonAsTemporaryFree: (nftId: NFTId) => void
  resetAllCosmonsTemporaryFree: () => void
  fetchWalletData: () => void
  initIbc: (amount: Coin, deposit: boolean) => void
  getAirdropData: () => void
  claimAirdrop: () => any
  resetClaimData: () => void
  searchTx: (txMethodType: IndexedTxMethodType) => Promise<CustomIndexedTx>
  setShowWithdrawDepositModal: (type?: 'withdraw' | 'deposit') => void
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
      isFetchingCosmons: false,
      isCurrentlyIbcTransferring: false,
      signingClient: null,
      stargateSigningClient: null,
      ibcSigningClient: null,
      isConnected: false,
      cosmosConnectionProvider: null,
      hasSubscribed: false,
      isEligibleForAirdrop: null,

      setHasSubscribed: (hasSubscribed) => {
        set({
          hasSubscribed: hasSubscribed,
        })
      },
      connect: async (type?: CONNECTION_TYPE) => {
        set({
          isFetchingData: true,
        })

        try {
          let offlineSigner = null,
            ibcOfflineSigner = null

          if (type) {
            switch (type) {
              case CONNECTION_TYPE.KEPLR:
                const [keplrOfflineSigner, keplrIbcOfflineSigner] = await connectKeplr()

                offlineSigner = keplrOfflineSigner
                ibcOfflineSigner = keplrIbcOfflineSigner

                break
              case CONNECTION_TYPE.COSMOSTATION:
                const [cosmostationOfflineSigner, cosmostationIbcOfflineSigner, provider] =
                  await connectWithCosmostation()

                offlineSigner = cosmostationOfflineSigner
                ibcOfflineSigner = cosmostationIbcOfflineSigner

                set({ cosmosConnectionProvider: provider })

                break
              default:
                break
            }
          }

          if (!offlineSigner && !ibcOfflineSigner) {
            return
          }

          const client = await makeClient(offlineSigner!)

          set({
            signingClient: client,
            stargateSigningClient:
              (offlineSigner && (await makeStargateClient(offlineSigner!))) || null,
            ibcSigningClient:
              (ibcOfflineSigner && (await makeIbcClient(ibcOfflineSigner!))) || null,
          })

          // get user address
          const accounts = (offlineSigner && (await offlineSigner!.getAccounts())) || [
            { address: '' },
          ]
          const ibcAccounts = (ibcOfflineSigner && (await ibcOfflineSigner!.getAccounts())) || [
            { address: '' },
          ]

          console.log(accounts)

          set({
            address: accounts[0].address,
            ibcAddress: ibcAccounts[0].address,
            isConnected: true,
          })

          saveLastConnection({ type })
        } catch (error: any) {
          console.error('error while connecting', error)
        } finally {
          set({
            isFetchingData: false,
          })
        }
      },
      setCosmons: (cosmons) => {
        set({ cosmons })
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
                    <ToastContainer type="success">Wallet credited successfully</ToastContainer>
                  )
                },
                icon: SuccessIcon,
              },
              error: {
                render({ data }: any) {
                  return <ToastContainer type="error">{data.message}</ToastContainer>
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
      initIbc: async (amount: Coin, deposit: boolean) => {
        const { stargateSigningClient, ibcSigningClient, fetchWalletData, ibcAddress, address } =
          get()
        if (stargateSigningClient && address && ibcSigningClient && ibcAddress) {
          set({
            isCurrentlyIbcTransferring: true,
          })
          const response = await toast
            .promise(
              initIbc(
                stargateSigningClient,
                ibcSigningClient,
                address,
                ibcAddress,
                deposit,
                amount
              ),
              {
                pending: {
                  render() {
                    return (
                      <ToastContainer type="pending">{`IBC transfer initalized`}</ToastContainer>
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
                    return <ToastContainer type="error">{data.message}</ToastContainer>
                  },
                  icon: ErrorIcon,
                },
              }
            )
            .then(async ({ token }: any) => {
              set({
                isCurrentlyIbcTransferring: false,
              })
              fetchWalletData()
            })
            .finally(() => {
              set({
                isCurrentlyIbcTransferring: false,
              })
            })
          // return response
        }
      },
      fetchWalletData: async () => {
        set({
          isFetchingData: true,
        })
        const { fetchSellData } = useCosmonStore.getState()
        const { getRewardsData } = useRewardStore.getState()
        await fetchSellData()
        const { fetchCoin, fetchCosmons } = get()
        await fetchCosmons()
        await fetchCoin()
        await getRewardsData()
        // await fetchRewards()
        set({
          // maxClaimableToken: maxClaimableToken,
          isFetchingData: false,
        })
      },
      fetchCoin: async () => {
        const { signingClient, ibcSigningClient, address, ibcAddress, coins, ibcCoins } = get()
        if (signingClient && address) {
          try {
            const mainCoin = await signingClient.getBalance(address, PUBLIC_STAKING_DENOM)
            const atomCoin = await signingClient.getBalance(address, PUBLIC_STAKING_IBC_DENOM)

            let newCoins = coins.filter(
              (coin) =>
                coin.denom !== PUBLIC_STAKING_DENOM && coin.denom !== PUBLIC_STAKING_IBC_DENOM
            )
            newCoins.push(mainCoin, atomCoin)
            set({
              coins: newCoins,
            })
          } catch (e) {
            console.error(`Error while fetching coin`, e)
          }
        }

        if (ibcSigningClient && ibcAddress) {
          try {
            const mainCoin = await ibcSigningClient.getBalance(
              ibcAddress,
              PUBLIC_STAKING_IBC_DENOM_ON_CHAIN
            )

            let newCoins = coins.filter((coin) => coin.denom !== PUBLIC_STAKING_IBC_DENOM_ON_CHAIN)
            newCoins.push(mainCoin)
            set({
              ibcCoins: newCoins,
            })
          } catch (e) {
            console.error('Error while fetching ibc coin', e)
          }
        }
      },
      fetchCosmons: async () => {
        set({
          isFetchingCosmons: true,
        })
        const { signingClient, address } = get()
        if (signingClient && address) {
          try {
            const tokens: string[] = await fetch_tokens(signingClient, address)

            // getting cosmon details
            let myCosmons: CosmonType[] = await Promise.all(
              tokens.map(async (token: string) => {
                const cosmon = await queryCosmonInfo(signingClient, token)
                const stats = await XPRegistryService.queries().getCosmonStats(token)
                return {
                  id: token,
                  data: cosmon,
                  isInDeck: false,
                  stats,
                }
              })
            )

            if (myCosmons.length) {
              const cosmonIdsAlreadyInDecks = await DeckService.queries().isNftsInADeck(
                myCosmons.map((c) => c.id)
              )

              myCosmons = myCosmons.map((c, i) => ({
                ...c,
                isInDeck: cosmonIdsAlreadyInDecks[i],
              }))
              set({
                cosmons: sortCosmonsByScarcity(myCosmons).map(
                  (cosmon) => get().cosmons.find((c) => c.id === cosmon.id) || cosmon
                ),
              })
              return sortCosmonsByScarcity(myCosmons).map(
                (cosmon) => get().cosmons.find((c) => c.id === cosmon.id) || cosmon
              )
            }
            return []
          } catch (e) {
            console.error('Error while fetching cosmons', e)
          } finally {
            set({
              isFetchingCosmons: false,
            })
          }
        }
      },
      updateCosmonsAreInDeck: async () => {
        const { cosmons } = get()

        let myCosmons = [...cosmons]
        const cosmonIdsAlreadyInDecks = await DeckService.queries().isNftsInADeck(
          cosmons.map((c) => c.id)
        )

        myCosmons = myCosmons.map((c, i) => ({
          ...c,
          isInDeck: cosmonIdsAlreadyInDecks[i],
        }))

        set({
          cosmons: [...sortCosmonsByScarcity(myCosmons)],
        })
      },
      markCosmonAsTemporaryFree: async (nftIdToMark: NFTId) => {
        const { cosmons } = get()
        let myCosmons = [...cosmons]
        let cosmonToUpdate = myCosmons.find((c) => c.id === nftIdToMark)
        if (cosmonToUpdate) {
          cosmonToUpdate = { ...cosmonToUpdate, temporaryFree: true }
        }
        set({
          cosmons: [
            ...sortCosmonsByScarcity(cosmons.filter((c) => c.id !== nftIdToMark)),
            cosmonToUpdate!,
          ],
        })
      },
      resetAllCosmonsTemporaryFree: () => {
        const { cosmons } = get()
        set({
          cosmons: [
            ...sortCosmonsByScarcity(cosmons.map((c) => ({ ...c, temporaryFree: undefined }))),
          ],
        })
      },
      buyCosmon: async (scarcity, price) => {
        const { signingClient, fetchCosmons, address, fetchCoin } = get()
        if (signingClient && address) {
          const response = await toast
            .promise(executeBuyCosmon(signingClient, price, address, scarcity), {
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
                  return <ToastContainer type="error">{data.message}</ToastContainer>
                },
                icon: ErrorIcon,
              },
            })
            .then(({ token }: any) => {
              fetchCosmons()
              // update wallet available balance
              fetchCoin()
              return token
            })
          return response
        }
      },
      transferAsset: async (recipient: string, asset: CosmonType) => {
        const { signingClient, fetchCosmons, address } = get()
        if (signingClient && address) {
          toast
            .promise(executeTransferNft(signingClient, address, recipient, asset.id), {
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
                      {`${asset.data.extension.name}`} transferred successfully,
                    </ToastContainer>
                  )
                },
                icon: SuccessIcon,
              },

              error: {
                render({ data }: any) {
                  return <ToastContainer type="error">{data.message}</ToastContainer>
                },
                icon: ErrorIcon,
              },
            })
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
          signingClient && (await queryCheckAirdropEligibility(signingClient, address))

        if (!isEligible) {
          set({
            airdropData: {
              isEligible: false,
            },
          })
        } else {
          const claimData = signingClient && (await queryGetClaimData(signingClient, address))
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
          const response = await toast
            .promise(executeClaimAirdrop(signingClient, address), {
              pending: {
                render() {
                  return <ToastContainer type="pending">{`Claiming cosmon airdrop`}</ToastContainer>
                },
              },
              success: {
                render() {
                  return (
                    <ToastContainer type={'success'}>Cosmon claimed successfully,</ToastContainer>
                  )
                },
                icon: SuccessIcon,
              },

              error: {
                render({ data }: any) {
                  return <ToastContainer type="error">{data.message}</ToastContainer>
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
      disconnect: async () => {
        get().signingClient?.disconnect()
        removeLastConnection()
        set({
          address: '',
          signingClient: null,
          isConnected: false,
          cosmons: [],
        })
      },
      searchTx: async (txMethodType: IndexedTxMethodType): Promise<CustomIndexedTx> => {
        const client = await makeStargateClientUnsigned()
        const height = await client.getHeight()

        const tags = [
          {
            key: 'wasm.method',
            value: txMethodType,
          },
        ]

        const searchUntilResult = (
          currentStep: number,
          step: number,
          nbTries: number
        ): Promise<CustomIndexedTx> => {
          return new Promise(async (resolve) => {
            const resp = await client?.searchTx({ tags }, { minHeight: height - currentStep })
            if (resp && resp.length > 0) {
              // Order is last row has the higher block height
              const mostRecentResult = resp[resp.length - 1]
              // Fetch block info to retrieve time info
              const block = await client.getBlock(mostRecentResult.height)
              return resolve({ ...mostRecentResult, time: block.header.time })
            }
            // Every 3 tries, will double the step to find results faster
            const nextStep = (nbTries % 3 === 0 && step * 2) || step
            return resolve(searchUntilResult(currentStep + step, nextStep, ++nbTries))
          })
        }

        const searchRes = await searchUntilResult(
          SEARCH_BLOCKCHAIN_HEIGHT_STEPS,
          SEARCH_BLOCKCHAIN_HEIGHT_STEPS,
          1
        )

        return searchRes
      },
    }),
    {
      name: 'wallet',
      partialize: (state) => ({ address: state.address }),
    }
  )
)

export { useWalletStore }
