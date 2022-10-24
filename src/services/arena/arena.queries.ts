import { makeUnsignedClient } from '@services/keplr'
import { useWalletStore } from '../../store/walletStore'

/**
 * Fetch the fees of the arena
 * @return fees
 */
export const fetchArenaFees = async (arenaAddress: string) => {
  try {
    const client = await makeUnsignedClient()
    const fees = await client?.queryContractSmart(arenaAddress, {
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
export const fetchCurrentPrizePool = async (arenaAddress: string) => {
  try {
    const client = await makeUnsignedClient()
    const currentPrizePool = await client?.queryContractSmart(arenaAddress, {
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
export const fetchNextPrizePool = async (arenaAddress: string) => {
  try {
    const client = await makeUnsignedClient()
    const nextPrizePool = await client?.queryContractSmart(arenaAddress, {
      get_next_prize_pool: {},
    })
    return nextPrizePool
  } catch (e) {
    console.error(`Error while fetching current prize pool `, e)
  }
}

/**
 * Fetch the current championship number
 * @retun championshipNumber
 */
export const fetchCurrentChampionshipNumber = async (arenaAddress: string) => {
  try {
    const client = await makeUnsignedClient()
    const championshipNumber = await client?.queryContractSmart(arenaAddress, {
      get_season_number: {},
    })
    return championshipNumber
  } catch (e) {
    console.error(`Error while fetching current prize pool `, e)
  }
}

/**
 * Fetch the prize for a given wallet address
 * @retun prizes
 */
export const fetchPrizesForAddress = async (arenaAddress: string) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const prizes = await signingClient?.queryContractSmart(arenaAddress, {
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
export const fetchCurrentLeaderboard = async (
  arenaAddress: string,
  limit: number,
  lastScore: number | null
) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const currentLeaderboard = await signingClient?.queryContractSmart(arenaAddress, {
      get_leaderboard_by_score: { limit, last_score: lastScore },
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
export const fetchOldLeaderboard = async (arenaAddress: string) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const oldLeaderboard = await signingClient?.queryContractSmart(arenaAddress, {
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
export const fetchWalletInfos = async (arenaAddress: string, walletAddress: string) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const walletInfos = await signingClient?.queryContractSmart(arenaAddress, {
      get_wallet_infos: { address: walletAddress },
    })

    return walletInfos
  } catch (e) {
    console.error(`Error while fetching wallet infos`, e)
  }
}

/**
 * Fetch walletsInfos
 * @retun walletsInfos
 */
export const fetchWalletsInfos = async (arenaAddress: string, walletsAddress: string[]) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const walletsInfos = await signingClient?.queryContractSmart(arenaAddress, {
      get_wallets_infos: { addresses: walletsAddress },
    })

    return walletsInfos
  } catch (e) {
    console.error(`Error while fetching wallets infos`, e)
  }
}

/**
 * Fetch your wallet rank in league
 * @retun your rank in league
 */
export const fetchRankForAddress = async (arenaAddress: string, walletAddress: string) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const rank = await signingClient?.queryContractSmart(arenaAddress, {
      get_rank_for_address: { address: walletAddress },
    })

    return rank
  } catch (e) {
    console.error(`Error while fetching wallet rank in league`, e)
  }
}

/**
 * Fetch your daily combat in the league
 * @retun your daily combat limit in the league
 */
export const fetchDailyCombat = async (arenaAddress: string, walletAddress: string) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const dailyCombat = await signingClient?.queryContractSmart(arenaAddress, {
      get_daily_combat: { address: walletAddress },
    })

    return dailyCombat
  } catch (e) {
    console.error(`Error while fetching daily comnbat in league`, e)
  }
}

/**
 * Fetch max daily combat in the league
 * @retun max daily combat limit in the league
 */
export const fetchMaxDailyCombat = async (arenaAddress: string) => {
  try {
    const { signingClient } = useWalletStore.getState()

    const dailyCombat = await signingClient?.queryContractSmart(arenaAddress, {
      get_max_daily_combat: {},
    })

    return dailyCombat
  } catch (e) {
    console.error(`Error while fetching max daily comnbat in league`, e)
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
  fetchWalletsInfos,
  fetchRankForAddress,
  fetchCurrentChampionshipNumber,
  fetchDailyCombat,
  fetchMaxDailyCombat,
}
