import { CosmonType, NFTId } from 'types'
import { useWalletStore } from '@store/walletStore'

const PUBLIC_XP_REGISTRY_CONTRACT = process.env.NEXT_PUBLIC_XP_REGISTRY_CONTRACT!

/**
 * Get stats of a cosmon
 * @param nftId id of the NFT
 */
export const getCosmonStats = async (nftId: NFTId) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(PUBLIC_XP_REGISTRY_CONTRACT, {
      get_cosmon_stats: { nft: nftId },
    })
    return response
  } catch (e) {
    console.error(`Error while fetching stats of cosmon id ${nftId}`, e)
  }
}

/**
 * Get hourly FP
 */
export const fecthHourlyFpNumber = async () => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(PUBLIC_XP_REGISTRY_CONTRACT, {
      get_hourly_fp_number: {},
    })
    return response
  } catch (e) {
    console.error(`Error while fetching FP number`, e)
  }
}

/**
 * Get boosts available
 */
export const fetchBoosts = async () => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(PUBLIC_XP_REGISTRY_CONTRACT, {
      get_boosts: {},
    })

    return response
  } catch (e) {
    console.error(`Error while fetching boosts list`, e)
  }
}

/**
 * Get boosts for a cosmon
 */
export const fecthBoostsForCosmon = async (cosmon: CosmonType) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(PUBLIC_XP_REGISTRY_CONTRACT, {
      get_boosts_for_nft: {
        nft_id: cosmon.id,
      },
    })

    return response
  } catch (e) {
    console.error(`Error while fetching boosts for cosmon ${cosmon.data.extension.name}`, e)
  }
}

/**
 * Get boosts for cosmons
 */
export const fecthBoostsForCosmons = async (cosmonsIds: string[]) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(PUBLIC_XP_REGISTRY_CONTRACT, {
      get_boosts_for_nfts: {
        nft_ids: cosmonsIds,
      },
    })

    return response
  } catch (e) {
    console.error(`Error while fetching boosts for cosmons`, e)
  }
}

export default {
  getCosmonStats,
  fecthHourlyFpNumber,
  fetchBoosts,
  fecthBoostsForCosmon,
  fecthBoostsForCosmons,
}
