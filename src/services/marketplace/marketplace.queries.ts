import { Coin } from '@cosmjs/proto-signing'
import { makeUnsignedClient } from '@services/connection/cosmos-clients'

const PUBLIC_MARKETPLACE_CONTRACT = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!

/**
 * Fetch all selling nft
 * @return all selling nft
 */

interface SellDataResponse {
  price: number
  address: string
  nft: string
  collection: string
  expire: any
}

export const fetchAllSellingNft = async ({
  start_after,
  limit,
}: {
  start_after:
    | {
        price?: number
        token_id?: string
      }
    | undefined
  limit: number | undefined
}): Promise<SellDataResponse[] | undefined> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_all_selling_nft: {
        start_after,
        limit,
        order: 'low_to_high',
      },
    })) as SellDataResponse[]

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
): Promise<SellDataResponse[] | undefined> => {
  try {
    const client = await makeUnsignedClient()
    const response = (await client?.queryContractSmart(PUBLIC_MARKETPLACE_CONTRACT, {
      get_selling_nft_from_address: {
        address: walletAddress,
      },
    })) as SellDataResponse[]

    return response
  } catch (e) {
    console.error(`Error while fetching all selling nft from wallet`, e)
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

export default {
  fetchAllSellingNft,
  fetchSellingNftFromAddress,
  fetchKpi,
}
