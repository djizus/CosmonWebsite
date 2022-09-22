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

export default {
  fetchArenaFees,
  fetchCurrentPrizePool,
  fetchNextPrizePool,
  fetchPrizesForAddress,
}
