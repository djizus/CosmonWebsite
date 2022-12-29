import create from 'zustand'
import { Coin } from '@cosmjs/proto-signing'
import { CosmonMarketPlaceType, NftHistory } from 'types'
import { toast } from 'react-toastify'
import { ToastContainer } from '@components/ToastContainer/ToastContainer'
import SuccessIcon from '@public/icons/success.svg'
import ErrorIcon from '@public/icons/error.svg'
import { MarketPlaceService } from '@services/marketplace'
import { useWalletStore } from './walletStore'
import { XPRegistryService } from '@services/xp-registry'
import { queryCosmonInfo } from '@services/interaction'
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from '@utils/conversion'
import { itemPerPage } from '@containers/marketplace'

interface MarketPlaceState {
  myListedCosmons: CosmonMarketPlaceType[]
  detailedCosmon: CosmonMarketPlaceType | null
  detailedCosmonLoading: boolean
  cosmonsInMarketplace: CosmonMarketPlaceType[]
  buyNftLoading: boolean
  floor: Coin | null
  totalVolume: Coin | null
  salesNumber: number
  marketplaceFees: number
  listNft: (nftId: string, price: Coin) => void
  listNftLoading: boolean
  unlistNftLoading: boolean
  unlistNft: (nftId: string) => void
  buyNft: (nftId: string, price: Coin) => Promise<boolean>
  fetchSellingNftFromAddress: (walletAddress: string) => void
  fetchKPI: () => void
  cosmonsForMarketPlaceLoading: boolean
  fetchCosmonsForMarketPlace: (limit: number, init: boolean) => void
  CosmonsInMarketplaceLoading: boolean
  fetchDetailedCosmon: (id: string) => void
  fetchCosmonHistory: (id: string) => Promise<NftHistory[]>
}

export const WINNER_IS_DRAW = 'DRAW'

export const useMarketPlaceStore = create<MarketPlaceState>((set, get) => ({
  myListedCosmons: [],
  detailedCosmon: null,
  detailedCosmonLoading: false,
  cosmonsInMarketplace: [],
  floor: null,
  totalVolume: null,
  salesNumber: 0,
  marketplaceFees: 0,
  listNftLoading: false,
  unlistNftLoading: false,
  buyNftLoading: false,
  cosmonsForMarketPlaceLoading: false,
  CosmonsInMarketplaceLoading: false,
  listNft: async (nftId: string, price: Coin) => {
    try {
      set({ listNftLoading: true })

      await toast
        .promise(MarketPlaceService.executes().listNft(nftId, price), {
          pending: {
            render() {
              return <ToastContainer type="pending">Listing your cosmon</ToastContainer>
            },
          },
          success: {
            render() {
              return <ToastContainer type={'success'}>Cosmon successfully listed</ToastContainer>
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
        .then(async (data) => {
          const { updateCosmons } = useWalletStore.getState()

          await updateCosmons([nftId])
          set({ listNftLoading: false })
        })
        .catch(() => {
          set({ listNftLoading: false })
        })
    } catch (error) {
      console.error(error)
    }
  },
  unlistNft: async (nftId: string) => {
    try {
      set({ unlistNftLoading: true })
      await toast
        .promise(MarketPlaceService.executes().unlistNft(nftId), {
          pending: {
            render() {
              return <ToastContainer type="pending">Unlisting your cosmon</ToastContainer>
            },
          },
          success: {
            render() {
              return <ToastContainer type={'success'}>Cosmon successfully unlisted</ToastContainer>
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
        .then(async (data) => {
          const { updateCosmons } = useWalletStore.getState()

          await updateCosmons([nftId])
        })
        .catch(() => {
          set({ unlistNftLoading: false })
        })
    } catch (error) {
      console.error(error)
    }
  },
  buyNft: async (nftId: string, price: Coin): Promise<boolean> => {
    try {
      set({ buyNftLoading: true })
      await toast
        .promise(MarketPlaceService.executes().buyNft(nftId, price), {
          pending: {
            render() {
              return <ToastContainer type="pending">Buying your cosmon</ToastContainer>
            },
          },
          success: {
            render() {
              return <ToastContainer type={'success'}>Cosmon successfully bought</ToastContainer>
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
        .then(async () => {
          const { fetchCosmons } = useWalletStore.getState()
          const { fetchCosmonsForMarketPlace } = get()

          await fetchCosmonsForMarketPlace(itemPerPage, true)
          await fetchCosmons()
          set({ buyNftLoading: false })
        })
        .catch(() => {
          set({ buyNftLoading: false })
        })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },
  fetchSellingNftFromAddress: async () => {
    try {
      const { address, signingClient } = useWalletStore.getState()
      const listedNftsFromAddress = await MarketPlaceService.queries().fetchSellingNftFromAddress(
        address
      )

      if (listedNftsFromAddress && signingClient) {
        // getting cosmon details
        let myCosmons: CosmonMarketPlaceType[] = await Promise.all(
          listedNftsFromAddress.map(async (nft) => {
            const cosmon = await queryCosmonInfo(signingClient, nft.nft)
            const stats = await XPRegistryService.queries().getCosmonStats(nft.nft)

            return {
              id: nft.nft,
              data: cosmon,
              isInDeck: false,
              stats,
              isListed: true,
              statsWithoutBoosts: stats,
              boosts: [null, null, null],
              price: convertMicroDenomToDenom(nft.price ?? ''),
              collection: nft.collection,
              owner: nft.address,
              expire: nft.expire,
            }
          })
        )

        if (myCosmons.length > 0) {
          set({
            myListedCosmons: myCosmons,
          })

          return myCosmons
        }
      }

      return listedNftsFromAddress
    } catch (error) {
      console.error(error)
    }
  },
  fetchKPI: async () => {
    try {
      const response = await MarketPlaceService.queries().fetchKpi()

      console.log(response)

      if (response) {
        set({
          floor: response.floor,
          totalVolume: response.total_volume,
          marketplaceFees: response.marketplace_fees,
          salesNumber: response.sales_number,
        })
      }

      return response
    } catch (error) {
      console.error(error)
    }
  },
  fetchCosmonsForMarketPlace: async (limit: number, init: boolean) => {
    set({
      cosmonsForMarketPlaceLoading: true,
    })
    const { signingClient } = useWalletStore.getState()
    const { cosmonsInMarketplace } = get()
    try {
      const lastCosmon = cosmonsInMarketplace.at(-1)
      const nfts = await MarketPlaceService.queries().fetchAllSellingNft({
        limit,
        start_after:
          lastCosmon !== undefined && !init
            ? {
                token_id: lastCosmon.id,
                price: convertDenomToMicroDenom(lastCosmon.price ?? ''),
              }
            : undefined,
      })

      if (nfts && signingClient) {
        // getting cosmon details
        let myCosmons: CosmonMarketPlaceType[] = await Promise.all(
          nfts.map(async (nft) => {
            const cosmon = await queryCosmonInfo(signingClient, nft.nft)
            const stats = await XPRegistryService.queries().getCosmonStats(nft.nft)

            return {
              id: nft.nft,
              data: cosmon,
              isInDeck: false,
              stats,
              isListed: true,
              statsWithoutBoosts: stats,
              boosts: [null, null, null],
              price: convertMicroDenomToDenom(nft.price ?? ''),
              collection: nft.collection,
              owner: nft.address,
              expire: nft.expire,
            }
          })
        )

        if (myCosmons.length > 0) {
          if (init) {
            set({
              cosmonsInMarketplace: myCosmons,
            })
          } else {
            set({
              cosmonsInMarketplace: [...cosmonsInMarketplace, ...myCosmons],
            })
          }

          return myCosmons
        }
      }

      return []
    } catch (e) {
      console.error('Error while fetching cosmons', e)
    } finally {
      set({
        cosmonsForMarketPlaceLoading: false,
      })
    }
  },
  fetchDetailedCosmon: async (id: string) => {
    set({
      detailedCosmonLoading: true,
    })
    const { signingClient } = useWalletStore.getState()

    const sellData = await MarketPlaceService.queries().fetchSellDataForNft(id)

    try {
      if (signingClient) {
        const cosmon = await queryCosmonInfo(signingClient, id)
        const stats = await XPRegistryService.queries().getCosmonStats(id)

        const isListed = true

        const detailedCosmon: CosmonMarketPlaceType = {
          id: id,
          data: cosmon,
          isInDeck: false,
          stats,
          isListed: isListed,
          statsWithoutBoosts: stats,
          boosts: [null, null, null] as [null, null, null],
          price: convertMicroDenomToDenom(sellData?.price ?? ''),
          collection: sellData?.collection,
          owner: sellData?.address,
          expire: sellData?.expire,
        }

        set({
          detailedCosmon,
        })
        return detailedCosmon
      }

      return []
    } catch (e) {
      console.error('Error while fetching cosmon', e)
    } finally {
      set({
        detailedCosmonLoading: false,
      })
    }
  },
  fetchCosmonHistory: async (id: string) => {
    const { signingClient } = useWalletStore.getState()

    try {
      if (signingClient) {
        const history = await MarketPlaceService.queries().fetchNftHistory(id)

        return history ?? []
      }
    } catch (error) {
      console.error('Error while fetching nft history')
    }

    return []
  },
}))
