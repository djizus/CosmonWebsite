import { Coin } from '@cosmjs/proto-signing'
import { makeUnsignedClient } from '@services/connection/cosmos-clients'
import { convertDenomToMicroDenom } from '@utils/conversion'
import { NftHistory } from 'types/Cosmon'
import {
  FetchByGeoPaginationOptions,
  FetchByLevelPaginationOptions,
  FetchByLevelRangePaginationOptions,
  FetchByPersonalityPaginationOptions,
  FetchByPricePaginationOptions,
  FetchByPriceRangePaginationOptions,
  FetchByScarcityPaginationOptions,
  FetchByTimePaginationOptions,
  MarketplaceSortOrder,
  SellData,
} from 'types/MarketPlace'

const PUBLIC_MARKETPLACE_CONTRACT = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!

export const fetchAllSellingNft = async ({
  start_after,
  limit,
  order,
}: {
  start_after:
    | {
        price?: string
        token_id?: string
      }
    | undefined
  limit: number | undefined
  order: MarketplaceSortOrder
}): Promise<SellData[] | undefined> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_all_selling_nft: {
        start_after,
        limit,
        order,
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching all selling nft`, e)
  }
}

/**
 * Fetch all selling nft from wallet
 * @return all selling nft from wallet
 */
export const fetchSellingNftFromAddress = async (
  walletAddress: string
): Promise<SellData[] | undefined> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_selling_nft_from_address: {
        address: walletAddress,
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching all selling nft from wallet`, e)
  }
}

/**
 * Fetch selling data for nft
 * @return selling data for nft
 */
export const fetchSellDataForNft = async (nftId: string): Promise<SellData | undefined> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_sell_data: {
        nft: nftId,
      },
    })) as SellData

    return response
  } catch (e) {
    console.error(`Error while fetching selling data for nft`, e)
  }
}

/**
 * Fetch selling nft history
 * @return selling nft history
 */
export const fetchNftHistory = async (nftId: string): Promise<NftHistory[] | undefined> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_transaction_history: {
        nft_id: nftId,
      },
    })) as NftHistory[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft history`, e)
  }
}

export interface KPIResponse {
  floor: Coin
  total_volume: Coin
  sales_number: number
  marketplace_fees: number
}

/**
 * Fetch KPI
 * @return KPI
 */
export const fetchKpi = async (): Promise<undefined | KPIResponse> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_k_p_i: {},
    })) as KPIResponse

    return response
  } catch (e) {
    console.error(`Error while fetching KPI`, e)
  }
}

/**
 * Fetch Nft by price
 * @return Sell data[]
 */
export const fetchNftByPrice = async ({
  start_after,
  limit,
  price,
}: FetchByPricePaginationOptions): Promise<undefined | SellData[]> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_nft_by_price: {
        start_after,
        limit,
        price: convertDenomToMicroDenom(price),
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft by price`, e)
  }
}

/**
 * Fetch Nft by price range
 * @return Sell data[]
 */
export const fetchNftByPriceRange = async ({
  start_after,
  limit,
  min_price,
  max_price,
}: FetchByPriceRangePaginationOptions): Promise<undefined | SellData[]> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_nft_by_price_range: {
        start_after,
        limit,
        min_price: convertDenomToMicroDenom(min_price),
        max_price: convertDenomToMicroDenom(max_price),
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft with price range`, e)
  }
}

/**
 * Fetch Nft by level
 * @return Sell data[]
 */
export const fetchNftByLevel = async ({
  start_after,
  limit,
  level,
}: FetchByLevelPaginationOptions): Promise<undefined | SellData[]> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_nft_by_level: {
        start_after,
        limit,
        level,
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft by level`, e)
  }
}

/**
 * Fetch Nft by level range
 * @return Sell data[]
 */
export const fetchNftByLevelRange = async ({
  start_after,
  limit,
  level_min,
  level_max,
}: FetchByLevelRangePaginationOptions): Promise<undefined | SellData[]> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_nft_by_level_range: {
        start_after,
        limit,
        level_min: level_min,
        level_max: level_max,
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft with level range`, e)
  }
}

/**
 * Fetch Nft by personnality
 * @return Sell data[]
 */
export const fetchNftByPersonality = async ({
  start_after,
  limit,
  personnality,
}: FetchByPersonalityPaginationOptions): Promise<undefined | SellData[]> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_nft_by_personality: {
        start_after,
        limit,
        personality: personnality,
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft by personality`, e)
  }
}

/**
 * Fetch Nft by geo
 * @return Sell data[]
 */
export const fetchNftByGeo = async ({
  start_after,
  limit,
  geo,
}: FetchByGeoPaginationOptions): Promise<undefined | SellData[]> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_nft_by_geo: {
        start_after,
        limit,
        geo,
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft by geo`, e)
  }
}

/**
 * Fetch Nft by time
 * @return Sell data[]
 */
export const fetchNftByTime = async ({
  start_after,
  limit,
  time,
}: FetchByTimePaginationOptions): Promise<undefined | SellData[]> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_nft_by_time: {
        start_after,
        limit,
        time,
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft by time`, e)
  }
}

/**
 * Fetch Nft by time
 * @return Sell data[]
 */
export const fetchNftByScarcity = async ({
  start_after,
  limit,
  scarcity,
}: FetchByScarcityPaginationOptions): Promise<undefined | SellData[]> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_nft_by_scarcity: {
        start_after,
        limit,
        scarcity,
      },
    })) as SellData[]

    return response
  } catch (e) {
    console.error(`Error while fetching nft by scarcity`, e)
  }
}

export default {
  fetchAllSellingNft,
  fetchSellingNftFromAddress,
  fetchKpi,
  fetchSellDataForNft,
  fetchNftHistory,
  fetchNftByPrice,
  fetchNftByPriceRange,
  fetchNftByLevel,
  fetchNftByLevelRange,
  fetchNftByPersonality,
  fetchNftByGeo,
  fetchNftByTime,
  fetchNftByScarcity,
}
