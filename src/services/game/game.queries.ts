import { makeUnsignedClient } from '@services/connection/cosmos-clients'
import { ArenaType } from 'types/Arena'
import { useWalletStore } from '../../store/walletStore'

const PUBLIC_GAME_CONTRACT = process.env.NEXT_PUBLIC_GAME_CONTRACT!

/**
 * Get arenas
 */
export const getArenas = async (): Promise<ArenaType[] | undefined> => {
  try {
    const client = await makeUnsignedClient()
    const response = await client?.queryContractSmart(PUBLIC_GAME_CONTRACT, {
      get_arenas: {},
    })
    return response
  } catch (e) {
    console.error(`Error while fetching arenas`, e)
  }
}

/**
 * Retrieve the arenas to which the current wallet is registered
 */
export const getRegisteredArenasForWallet = async (): Promise<ArenaType[] | undefined> => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    if (address) {
      const response = await signingClient?.queryContractSmart(PUBLIC_GAME_CONTRACT, {
        get_registered_arenas_for_wallet: { address },
      })
      return response
    }
  } catch (e) {
    console.error(`Error while fetching registered arenas `, e)
  }
}

export default {
  getArenas,
  getRegisteredArenasForWallet,
}
