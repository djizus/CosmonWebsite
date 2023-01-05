import create from 'zustand'
import { Coin } from '@cosmjs/proto-signing'
import { CosmonMarketPlaceType, NftHistory, Time } from 'types'
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
import { MarketPlaceFilters, MarketplaceSortOrder, SellData } from 'types'
import intersectionBy from 'lodash/intersectionBy'
import isEqual from 'lodash/isEqual'
import { getCosmonStat } from '@utils/cosmon'

interface MarketPlaceState {
  filtersActive: boolean
  filters: MarketPlaceFilters
  sortOrder: MarketplaceSortOrder
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
  fetchSellData: (id: string) => Promise<SellData | undefined>
  setFilters: (filters: MarketPlaceFilters) => void
  setOrder: (sortOrder: MarketplaceSortOrder) => void
  clearFilters: () => void
}

export const WINNER_IS_DRAW = 'DRAW'

export const useMarketPlaceStore = create<MarketPlaceState>((set, get) => ({
  filtersActive: false,
  filters: {
    name: '',
    price: {
      min: '',
      max: '',
    },
    levels: {
      min: '',
      max: '',
    },
    scarcity: [],
    time: [],
    geographical: [],
    personnality: [],
  },
  sortOrder: 'low_to_high',
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
    const { cosmonsInMarketplace, filtersActive, filters, sortOrder } = get()
    const lastCosmon = cosmonsInMarketplace.at(-1)
    const lastCosmonLevel = lastCosmon ? getCosmonStat(lastCosmon.stats, 'Level')?.value : undefined
    const start_after =
      lastCosmon !== undefined && !init
        ? {
            token_id: lastCosmon.id,
            price: convertDenomToMicroDenom(lastCosmon.price ?? ''),
            level: lastCosmonLevel ? parseInt(lastCosmonLevel) : undefined,
          }
        : undefined

    try {
      let nfts: SellData[] = []
      if (filtersActive) {
        let timeResult: SellData[] = []
        let personalityResult: SellData[] = []
        let geoResult: SellData[] = []
        let scarcityResult: SellData[] = []
        let priceResult: SellData[] = []
        let levelResult: SellData[] = []
        let arrayToCompare: Array<SellData[]> = []

        if (filters.time.length > 0) {
          timeResult = await Promise.all(
            filters.time.map(async (filter) => {
              return (
                (await MarketPlaceService.queries().fetchNftByTime({
                  limit,
                  start_after,
                  time: filter,
                })) ?? []
              )
            })
          ).then((value) => value.flat())

          arrayToCompare = [...arrayToCompare, timeResult]
        }

        if (filters.personnality.length > 0) {
          personalityResult = await Promise.all(
            filters.personnality.map(async (filter) => {
              return (
                (await MarketPlaceService.queries().fetchNftByPersonality({
                  limit,
                  start_after,
                  personnality: filter,
                })) ?? []
              )
            })
          ).then((value) => value.flat())

          arrayToCompare = [...arrayToCompare, personalityResult]
        }

        if (filters.geographical.length > 0) {
          geoResult = await Promise.all(
            filters.geographical.map(async (filter) => {
              return (
                (await MarketPlaceService.queries().fetchNftByGeo({
                  limit,
                  start_after,
                  geo: filter,
                })) ?? []
              )
            })
          ).then((value) => value.flat())

          arrayToCompare = [...arrayToCompare, geoResult]
        }

        if (filters.scarcity.length > 0) {
          scarcityResult = await Promise.all(
            filters.scarcity.map(async (filter) => {
              return (
                (await MarketPlaceService.queries().fetchNftByScarcity({
                  limit,
                  start_after,
                  scarcity: filter,
                })) ?? []
              )
            })
          ).then((value) => value.flat())

          arrayToCompare = [...arrayToCompare, scarcityResult]
        }

        if (
          (filters.price.min !== '' && filters.price.max === '') ||
          (filters.price.min === '' && filters.price.max !== '')
        ) {
          const price = filters.price.min !== '' ? filters.price.min : filters.price.max

          priceResult =
            (await MarketPlaceService.queries().fetchNftByPrice({
              limit,
              start_after,
              price: parseFloat(price),
            })) ?? []

          arrayToCompare = [...arrayToCompare, priceResult]
        } else if (filters.price.min !== '' && filters.price.max !== '') {
          priceResult =
            (await MarketPlaceService.queries().fetchNftByPriceRange({
              limit,
              start_after,
              min_price: parseFloat(filters.price.min),
              max_price: parseFloat(filters.price.max),
            })) ?? []

          arrayToCompare = [...arrayToCompare, priceResult]
        }

        if (
          (filters.levels.min !== '' && filters.levels.max === '') ||
          (filters.levels.min === '' && filters.levels.max !== '')
        ) {
          const level = filters.levels.min !== '' ? filters.levels.min : filters.levels.max

          levelResult =
            (await MarketPlaceService.queries().fetchNftByLevel({
              limit,
              start_after,
              level: parseFloat(level),
            })) ?? []

          arrayToCompare = [...arrayToCompare, levelResult]
        } else if (filters.levels.min !== '' && filters.levels.max !== '') {
          levelResult =
            (await MarketPlaceService.queries().fetchNftByLevelRange({
              limit,
              start_after,
              level_min: parseFloat(filters.levels.min),
              level_max: parseFloat(filters.levels.max),
            })) ?? []

          arrayToCompare = [...arrayToCompare, levelResult]
        }

        nfts = arrayToCompare.reduce((acc, curr, index) => {
          if (acc.length === 0 && index === 0) {
            return [...curr]
          }

          return intersectionBy(acc, curr, 'nft')
        }, [])
      } else {
        nfts =
          (await MarketPlaceService.queries().fetchAllSellingNft({
            limit,
            start_after,
            order: sortOrder,
          })) ?? []
      }

      if (nfts.length > 0 && signingClient) {
        // getting cosmon details
        let myCosmons: CosmonMarketPlaceType[] = await Promise.all(
          nfts.map(async (nft) => {
            const cosmon = await queryCosmonInfo(signingClient, nft.nft)

            return {
              id: nft.nft,
              data: cosmon,
              isInDeck: false,
              stats: [
                {
                  key: 'Level',
                  value: nft.level.toString(),
                },
              ],
              isListed: true,
              statsWithoutBoosts: [
                {
                  key: 'Level',
                  value: nft.level.toString(),
                },
              ],
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

      set({
        cosmonsInMarketplace: [],
      })

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

        const detailedCosmon: CosmonMarketPlaceType = {
          id: id,
          data: cosmon,
          isInDeck: false,
          isListed: true,
          stats,
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
  fetchSellData: async (id: string) => {
    const { signingClient } = useWalletStore.getState()

    try {
      if (signingClient) {
        const sellData = await MarketPlaceService.queries().fetchSellDataForNft(id)

        return sellData
      }
    } catch (error) {
      console.error('Error while fetching sell data')
    }

    return undefined
  },
  setFilters: (filters: MarketPlaceFilters) => {
    if (
      isEqual(filters, {
        name: '',
        price: {
          min: '',
          max: '',
        },
        levels: {
          min: '',
          max: '',
        },
        scarcity: [],
        time: [],
        geographical: [],
        personnality: [],
      })
    ) {
      set({
        filters,
        filtersActive: false,
      })
    } else {
      set({
        filters,
        filtersActive: true,
      })
    }
  },
  setOrder: (sortOrder: MarketplaceSortOrder) => {
    set({
      sortOrder,
    })
  },
  clearFilters: () => {
    set({
      filters: {
        name: '',
        price: {
          min: '',
          max: '',
        },
        levels: {
          min: '',
          max: '',
        },
        scarcity: [],
        time: [],
        geographical: [],
        personnality: [],
      },
      filtersActive: false,
    })
  },
}))
