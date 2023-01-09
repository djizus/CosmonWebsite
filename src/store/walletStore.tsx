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
  executeBuyRandomCosmon,
  executeCreditWalletWithFaucet,
  queryCosmonInfo,
  executeTransferNft,
  queryCheckAirdropEligibility,
  queryGetClaimData,
  executeClaimAirdrop,
  initIbc,
  fetch_tokens,
  executeMintDeck,
} from '@services/interaction'
import { toast } from 'react-toastify'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import ErrorIcon from '/public/icons/error.svg'
import SuccessIcon from '/public/icons/success.svg'
import { useCosmonStore } from './cosmonStore'
import { useRewardStore } from './rewardStore'
import { sortCosmonsByScarcity } from '@utils/cosmon'
import { NFTId, CosmonType, Scarcity, KiInformationResponse } from 'types'
import { XPRegistryService } from '@services/xp-registry'
import { DeckService } from '@services/deck'
import { CustomIndexedTx, IndexedTxMethodType } from 'types/IndexedTxMethodType'
import { connectIbcClientWithKeplr, connectKeplr } from '@services/connection/keplr'
import {
  connectIbcClientWithCosmostation,
  connectWithCosmostation,
} from '@services/connection/cosmostation'
import { CONNECTED_WITH, CONNECTION_TYPE, CosmosConnectionProvider } from 'types/Connection'
import { getConnectedWithByType, removeLastConnection, saveLastConnection } from '@utils/connection'
import { getOfflineSignerCosmostation } from '@services/connection/cosmostation-walletconnect'
import { computeStatsWithoutBoosts, fillBoosts } from '@utils/boost'
import { useMarketPlaceStore } from './marketPlaceStore'
import { MarketPlaceService } from '@services/marketplace'
import axios from 'axios'
import { IS_MARKETPLACE_ACTIVE } from '@utils/constants'
import { SellData } from 'types'

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
  isLoadingIbcClientConnection: boolean
  airdropData?: {
    isEligible: boolean
    address?: string
    max_claimable?: number
    num_already_claimed?: number
  }
  connectedWith: CONNECTED_WITH | undefined
  connectionClientType: CONNECTION_TYPE | undefined
  signingClient: SigningCosmWasmClient | null
  stargateSigningClient: SigningStargateClient | null
  ibcSigningClient: SigningStargateClient | null
  maxClaimableToken?: number
  coins: Coin[]
  ibcCoins: Coin[]
  cosmons: CosmonType[]
  cosmonsId: string[]
  isCurrentlyIbcTransferring: boolean
  isConnected: boolean
  cosmosConnectionProvider?: CosmosConnectionProvider | null
  hasSubscribed: boolean
  showWithdrawDepositModal?: 'withdraw' | 'deposit'
  kiInfo: KiInformationResponse | undefined
  connect: (type?: CONNECTION_TYPE) => void
  setCosmons: (cosmons: CosmonType[]) => void
  buyCosmon: (scarcity: Scarcity, price: string) => any
  buyRandomCosmon: (price: Coin) => any
  mintFullDeck: (price: string) => any
  transferAsset: (recipient: string, asset: CosmonType) => void
  disconnect: () => void
  setHasSubscribed: (hasSubscribed: boolean) => void
  fetchCoin: () => void
  addMoneyFromFaucet: () => void
  fetchCosmons: () => Promise<string[]>
  fetchCosmonDetails: (
    cosmonId: string,
    isInDeck: boolean,
    listedNftsId: SellData[]
  ) => Promise<CosmonType>
  fetchCosmonsDetails: (cosmonsIds: string[]) => Promise<CosmonType[]>
  removeCosmon: (cosmonId: string) => void
  updateCosmons: (cosmonsIds: string[]) => Promise<CosmonType[]>
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
  getIbcSigningClient: () => Promise<SigningStargateClient | null>
  fetchKiInfo: () => void
}

const useWalletStore = create<WalletState>(
  persist(
    (set, get) => ({
      coins: [],
      ibcCoins: [],
      ibcDenom: process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN || '',
      cosmons: [],
      cosmonsId: [],
      address: '',
      ibcAddress: '',
      isFetchingData: false,
      isFetchingCosmons: false,
      isCurrentlyIbcTransferring: false,
      signingClient: null,
      stargateSigningClient: null,
      isLoadingIbcClientConnection: false,
      ibcSigningClient: null,
      isConnected: false,
      cosmosConnectionProvider: null,
      hasSubscribed: false,
      connectedWith: undefined,
      connectionClientType: undefined,
      kiInfo: undefined,
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
          let offlineSigner = null

          if (type) {
            switch (type) {
              case CONNECTION_TYPE.KEPLR:
                offlineSigner = await connectKeplr()
                break
              case CONNECTION_TYPE.COSMOSTATION:
                const [cosmostationOfflineSigner, provider] = await connectWithCosmostation()
                offlineSigner = cosmostationOfflineSigner
                set({
                  cosmosConnectionProvider: provider,
                })
                break
              case CONNECTION_TYPE.COSMOSTATION_WALLET_CONNECT:
                offlineSigner = await getOfflineSignerCosmostation()
                break
              default:
                break
            }
          }

          if (!offlineSigner) {
            return
          }

          const signingClient = await makeClient(offlineSigner!)
          const stargateSigningClient = await makeStargateClient(offlineSigner!)

          set({
            signingClient,
            stargateSigningClient,
          })

          // get user address
          const accounts = (offlineSigner && (await offlineSigner!.getAccounts())) || [
            { address: '' },
          ]

          set({
            address: accounts[0].address,
            isConnected: true,
            connectionClientType: type ?? undefined,
            connectedWith: (type && getConnectedWithByType(type)) || undefined,
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

      getIbcSigningClient: async () => {
        const { ibcSigningClient, connectionClientType } = get()
        if (!ibcSigningClient) {
          try {
            set({ isLoadingIbcClientConnection: true })
            let ibcOfflineSigner = null
            switch (connectionClientType) {
              case CONNECTION_TYPE.KEPLR:
                ibcOfflineSigner = await connectIbcClientWithKeplr()
                break
              case CONNECTION_TYPE.COSMOSTATION:
                ibcOfflineSigner = await connectIbcClientWithCosmostation()
                break
              case CONNECTION_TYPE.COSMOSTATION_WALLET_CONNECT:
                // You cannot make more than 1 connection at a time with cosmostation mobile
                // and we are already connected with the KiChain => return null
                // /!\ => Deposit & Withdraw not available with this type of connection
                ibcOfflineSigner = null
                break
              default:
                ibcOfflineSigner = null
                break
            }
            if (ibcOfflineSigner) {
              const ibcAccounts = (ibcOfflineSigner && (await ibcOfflineSigner!.getAccounts())) || [
                { address: '' },
              ]
              const ibcClient = await makeIbcClient(ibcOfflineSigner)
              set({
                ibcSigningClient: ibcClient,
                isLoadingIbcClientConnection: false,
                ibcAddress: ibcAccounts[0].address,
              })
              return ibcClient
            }
          } catch (error) {
          } finally {
            set({ isLoadingIbcClientConnection: false })
          }
        }
        return ibcSigningClient
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
        const { fetchKPI } = useMarketPlaceStore.getState()
        const { fetchCoin, fetchCosmons } = get()
        await fetchSellData()
        await fetchCosmons()
        await fetchCoin()
        await getRewardsData()
        if (IS_MARKETPLACE_ACTIVE) {
          await fetchKPI()
        }
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
            if (tokens.length > 0) {
              set({
                cosmonsId: tokens,
              })
              return tokens
            }
            return []
          } catch (e) {
            console.error('Error while fetching cosmons', e)
            return []
          } finally {
            set({
              isFetchingCosmons: false,
            })
            return []
          }
        }
        return []
      },
      fetchCosmonDetails: async (cosmonId: string, isInDeck: boolean, listedNftsId: SellData[]) => {
        const { signingClient } = get()
        const cosmon = await queryCosmonInfo(signingClient!, cosmonId)
        const stats = await XPRegistryService.queries().getCosmonStats(cosmonId)
        const boosts = await XPRegistryService.queries().fecthBoostsForCosmon(cosmonId)
        const isListed =
          listedNftsId.length > 0
            ? listedNftsId.findIndex((nft) => nft.nft === cosmonId) !== -1
            : false

        return {
          id: cosmonId,
          data: cosmon,
          isInDeck,
          stats,
          isListed,
          statsWithoutBoosts: computeStatsWithoutBoosts(stats, boosts),
          boosts: fillBoosts(boosts),
        }
      },
      fetchCosmonsDetails: async (cosmonsIds: string[]) => {
        const { fetchCosmonDetails, cosmons, cosmonsId, address } = get()
        set({ isFetchingCosmons: true })
        // For the case every or only needed cosmon have already been fetched
        if (
          cosmons.length > 0 &&
          (cosmons.length === cosmonsId.length ||
            cosmonsIds.every((neededId) => cosmons.map((c) => c.id).includes(neededId)))
        ) {
          set({ isFetchingCosmons: false })
          const co = cosmonsIds.map((cosmonId) =>
            cosmons.find((c) => c.id === cosmonId)
          ) as CosmonType[]
          if (co?.length) {
            return co
          } else {
            return []
          }
        }

        // For the case a given slice is missing in store
        let filteredCosmonsIds = cosmonsIds.filter(
          (id) => cosmons.map((c) => c.id).includes(id) === false
        )

        const cosmonIdsAlreadyInDecks = await DeckService.queries().isNftsInADeck(
          filteredCosmonsIds
        )
        let listedNftsId: SellData[] = []

        if (IS_MARKETPLACE_ACTIVE) {
          listedNftsId =
            (await MarketPlaceService.queries().fetchSellingNftFromAddress(address)) ?? []
        }
        let cosmonsWithDetails = []
        for (let index = 0; index < filteredCosmonsIds.length; index++) {
          const cosmonId = filteredCosmonsIds[index]
          const cosmon = await fetchCosmonDetails(
            cosmonId,
            cosmonIdsAlreadyInDecks[index],
            listedNftsId
          )
          cosmonsWithDetails.push(cosmon)
        }
        set({
          cosmons: Array.from(new Set(cosmons.concat(cosmonsWithDetails))),
          isFetchingCosmons: false,
        })
        return cosmonsWithDetails
      },
      removeCosmon: (cosmonId: string) => {
        const { cosmons } = get()
        const updatedCosmonsList = [...cosmons.filter((c) => c.id !== cosmonId)]
        set({ cosmons: updatedCosmonsList })
      },
      updateCosmons: async (cosmonsIds: string[]) => {
        const { fetchCosmonDetails, cosmons, address } = get()
        const cosmonIdsAlreadyInDecks = await DeckService.queries().isNftsInADeck(cosmonsIds)
        let listedNftsId: SellData[] = []

        if (IS_MARKETPLACE_ACTIVE) {
          listedNftsId =
            (await MarketPlaceService.queries().fetchSellingNftFromAddress(address)) ?? []
        }
        let freshCosmons: CosmonType[] = cosmons
        let updatedCosmons: CosmonType[] = []
        for (let index = 0; index < cosmonsIds.length; index++) {
          const cosmonId = cosmonsIds[index]
          const cosmon = await fetchCosmonDetails(
            cosmonId,
            cosmonIdsAlreadyInDecks[index],
            listedNftsId
          )
          updatedCosmons.push(cosmon)
          freshCosmons = freshCosmons.map((c) => {
            if (c.id === cosmonId) {
              return cosmon
            }
            return c
          })
        }

        set({ cosmons: sortCosmonsByScarcity(freshCosmons) })
        return updatedCosmons
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
        const { signingClient, address, fetchCoin, fetchCosmons } = get()
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
            .then(async ({ token }: any) => {
              // update wallet available balance
              await fetchCoin()
              await fetchCosmons()
              return token
            })
          return response
        }
      },
      buyRandomCosmon: async (price) => {
        const { signingClient, address, fetchCoin, fetchCosmons } = get()
        if (signingClient && address) {
          const response = await toast
            .promise(executeBuyRandomCosmon(signingClient, price, address), {
              pending: {
                render() {
                  return <ToastContainer type="pending">{`Buying a random cosmon`}</ToastContainer>
                },
              },
              success: {
                render() {
                  return (
                    <ToastContainer type={'success'}>
                      Random cosmon bought successfully,
                    </ToastContainer>
                  )
                },
                icon: SuccessIcon,
              },

              error: {
                render({ data }: any) {
                  return (
                    <ToastContainer type="error">
                      The whole collection has been sold! Get ready for the next one!
                    </ToastContainer>
                  )
                },
                icon: ErrorIcon,
              },
            })
            .then(async ({ token }: any) => {
              // update wallet available balance
              await fetchCoin()
              await fetchCosmons()
              return token
            })
          return response
        }
      },
      mintFullDeck: async (price: string) => {
        const { signingClient, address, fetchCoin, fetchCosmons } = get()
        if (signingClient && address) {
          const response = await toast
            .promise(executeMintDeck(signingClient, price, address), {
              pending: {
                render() {
                  return <ToastContainer type="pending">{`Buying your deck`}</ToastContainer>
                },
              },
              success: {
                render() {
                  return <ToastContainer type={'success'}>Deck bought successfully,</ToastContainer>
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
            .then(async ({ cosmons }: any) => {
              await fetchCoin()
              await fetchCosmons()
              return cosmons
            })
          return response
        }
      },
      transferAsset: async (recipient: string, asset: CosmonType) => {
        const { signingClient, address, removeCosmon, fetchCosmons } = get()
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
            .then(({ cosmon }: any) => {
              removeCosmon(asset.id)
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
        const { signingClient, address, getAirdropData, fetchCosmons } = get()
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
              await fetchCosmons()
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
      fetchKiInfo: async () => {
        const kiInfo = await axios({
          method: 'get',
          url: 'https://api-osmosis.imperator.co/tokens/v2/XKI',
        }).then(function (response) {
          return response.data[0]
        })

        set({
          kiInfo,
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
