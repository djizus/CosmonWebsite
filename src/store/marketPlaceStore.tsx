import create from 'zustand'
import { Coin } from '@cosmjs/proto-signing'
import { CosmonMarketPlaceType } from 'types'
import { toast } from 'react-toastify'
import { ToastContainer } from '@components/ToastContainer/ToastContainer'
import SuccessIcon from '@public/icons/success.svg'
import ErrorIcon from '@public/icons/error.svg'
import { MarketPlaceService } from '@services/marketplace'
import { useWalletStore } from './walletStore'
import { XPRegistryService } from '@services/xp-registry'
import { approveNft, queryCosmonInfo } from '@services/interaction'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { convertMicroDenomToDenom } from '@utils/conversion'
import { itemPerPage } from '@containers/marketplace'

interface MarketPlaceState {
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
  fetchCosmonsForMarketPlace: (limit: number) => void
  CosmonsInMarketplaceLoading: boolean
  fetchDetailedCosmon: (id: string) => void
}

export const WINNER_IS_DRAW = 'DRAW'

export const useMarketPlaceStore = create<MarketPlaceState>((set, get) => ({
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
      const { signingClient, address } = useWalletStore.getState()
      set({ listNftLoading: true })
      await approveNft(signingClient as SigningCosmWasmClient, address, nftId)

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
          const { fetchCosmons } = useWalletStore.getState()

          await fetchCosmons()
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
          const { fetchCosmons } = useWalletStore.getState()

          await fetchCosmons()
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
        .then(async (data) => {
          const { fetchCosmons } = useWalletStore.getState()
          const { fetchCosmonsForMarketPlace } = get()

          await fetchCosmonsForMarketPlace(itemPerPage)
          await fetchCosmons()
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
      const { address } = useWalletStore()
      const listedNftsFromAddress = await MarketPlaceService.queries().fetchSellingNftFromAddress(
        address
      )

      return listedNftsFromAddress
    } catch (error) {
      console.error(error)
    }
  },
  fetchKPI: async () => {
    try {
      const response = await MarketPlaceService.queries().fetchKpi()

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
  fetchCosmonsForMarketPlace: async (limit: number) => {
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
          lastCosmon !== undefined
            ? {
                token_id: lastCosmon.id,
                price: lastCosmon.price,
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
          set({
            cosmonsInMarketplace: myCosmons,
          })

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
    const { cosmonsInMarketplace } = get()

    const currentNft = cosmonsInMarketplace?.find((nft: CosmonMarketPlaceType) => nft.id === id)

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
          price: currentNft?.price,
          collection: currentNft?.collection,
          owner: currentNft?.owner,
          expire: currentNft?.expire,
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
}))
