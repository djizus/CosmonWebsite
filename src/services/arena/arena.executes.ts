import { useWalletStore } from '@store/walletStore'

const PUBLIC_ARENA_CONTRACT = process.env.NEXT_PUBLIC_TRAINING_CONTRACT!

/**
 * Claim prize
 * @param arenaAddress address of the arena
 */
export const claimPrize = async (arenaAddress: string) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      arenaAddress,
      { claim_prize: {} },
      'auto',
      '[COSMON] claim rewards'
    )

    return response
  } catch (e: any) {
    console.error(e)
    throw new Error(`Error while creating a deck`)
  }
}

export default {
  claimPrize,
}
