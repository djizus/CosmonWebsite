import { makeUnsignedClient } from '@services/keplr'
import { useWalletStore } from '../../store/walletStore'
import { ArenaService } from './arena.service'

/**
 * Fetch the fees of the arena
 * @return fees
 */
export const fetchArenaFees = async (contractAddress: string) => {
  try {
    const client = await makeUnsignedClient()
    const fees = await client?.queryContractSmart(contractAddress, {
      get_arena_fees: {},
    })
    return fees
  } catch (e) {
    console.error(`Error while fetching arena fees`, e)
  }
}

/**
 * Fetch the prize pool of the current championship
 * @retun currentPrizePool
 */
export const fetchCurrentPrizePool = async (contractAddress: string) => {
  try {
    const client = await makeUnsignedClient()
    const currentPrizePool = await client?.queryContractSmart(contractAddress, {
      get_current_prize_pool: {},
    })
    return currentPrizePool
  } catch (e) {
    console.error(`Error while fetching current prize pool `, e)
  }
}

/**
 * Fetch the prize pool of the next championship
 * @retun nextPrizePool
 */
export const fetchNextPrizePool = async (contractAddress: string) => {
  try {
    const client = await makeUnsignedClient()
    const nextPrizePool = await client?.queryContractSmart(contractAddress, {
      get_next_prize_pool: {},
    })
    return nextPrizePool
  } catch (e) {
    console.error(`Error while fetching current prize pool `, e)
  }
}

/**
 * Fetch the prize for a given wallet address
 * @retun prizes
 */
export const fetchPrizesForAddress = async (contractAddress: string) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const prizes = await signingClient?.queryContractSmart(contractAddress, {
      get_prizes_for_address: { address },
    })
    return prizes
  } catch (e) {
    console.error(`Error while fetching prize for address`, e)
  }
}

/**
 * Fetch current leaderboard
 * @retun currentLeaderboard
 */
export const fetchCurrentLeaderboard = async (contractAddress: string) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const currentLeaderboard = await signingClient?.queryContractSmart(contractAddress, {
      get_leaderboard_by_score: { limit: 10, last_score: null },
    })

    return currentLeaderboard
  } catch (e) {
    console.error(`Error while fetching current leaderboard`, e)
  }
}

/**
 * Fetch old leaderboard
 * @retun oldLeaderboard
 */
export const fetchOldLeaderboard = async (contractAddress: string) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const oldLeaderboard = await signingClient?.queryContractSmart(contractAddress, {
      get_old_leaderboard: { limit: 10, offset: 1 },
    })

    return oldLeaderboard
  } catch (e) {
    console.error(`Error while fetching old leaderboard`, e)
  }
}

/**
 * Fetch walletInfos
 * @retun walletInfos
 */
export const fetchWalletInfos = async (contractAddress: string) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const oldLeaderboard = await signingClient?.queryContractSmart(contractAddress, {
      get_wallet_infos: { address: contractAddress },
    })

    return oldLeaderboard
  } catch (e) {
    console.error(`Error while fetching wallet infos`, e)
  }
}

export default {
  fetchArenaFees,
  fetchCurrentPrizePool,
  fetchNextPrizePool,
  fetchPrizesForAddress,
  fetchCurrentLeaderboard,
  fetchOldLeaderboard,
  fetchWalletInfos,
}
