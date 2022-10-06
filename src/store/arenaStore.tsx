import create from 'zustand'
import { ArenaService } from '@services/arena'
import { Coin } from '@cosmjs/proto-signing'

interface ArenaState {
  // @TODO: Update typage when we can
  oldLeaderboard: any
  currentLeaderboard: any
  walletInfos: any
  arenaFees: any
  currentPrizePool: any
  nextPrizePool: any
  prizesForAddress: {
    to_claim: Coin[]
    total: Coin[]
  }
  fetchArenaFees: (contractAddress: string) => Promise<Coin[]>
  fetchCurrentPrizePool: (contractAddress: string) => Promise<Coin[]>
  fetchNextPrizePool: (contractAddress: string) => Promise<Coin[]>
  fetchPrizesForAddress: (contractAddress: string) => Promise<Coin[]>
  fetchCurrentLeaderBoard: (contractAddress: string) => void
  fetchOldLeaderBoard: (contractAddress: string) => void
  fetchWalletInfos: (contractAddress: string) => void
  loading: boolean
}

export const useArenaStore = create<ArenaState>((set, get) => ({
  // @TODO: Update typage when we can
  oldLeaderboard: null,
  currentLeaderboard: null,
  walletInfos: null,
  arenaFees: null,
  currentPrizePool: null,
  nextPrizePool: null,
  prizesForAddress: {
    to_claim: [],
    total: [],
  },
  loading: false,

  fetchArenaFees: async (contractAddress: string) => {
    try {
      const arenaFees = await ArenaService.queries().fetchArenaFees(contractAddress)

      set({
        arenaFees,
      })
      return arenaFees
    } catch (error) {
      console.error(error)
    }
  },
  fetchCurrentPrizePool: async (contractAddress: string) => {
    try {
      const currentPrizePool = await ArenaService.queries().fetchCurrentPrizePool(contractAddress)

      set({
        currentPrizePool,
      })
      return currentPrizePool
    } catch (error) {
      console.error(error)
    }
  },
  fetchNextPrizePool: async (contractAddress: string) => {
    try {
      const nextPrizePool = await ArenaService.queries().fetchNextPrizePool(contractAddress)

      set({
        nextPrizePool,
      })
      return nextPrizePool
    } catch (error) {
      console.error(error)
    }
  },
  fetchPrizesForAddress: async (contractAddress: string) => {
    try {
      const prizesForAddress = await ArenaService.queries().fetchPrizesForAddress(contractAddress)

      set({
        prizesForAddress: {
          to_claim: [],
          total: [],
        },
      })

      return prizesForAddress
    } catch (error) {
      console.error(error)
    }
  },
  fetchCurrentLeaderBoard: async (contractAddress: string) => {
    try {
      const currentLeaderboard = await ArenaService.queries().fetchCurrentLeaderboard(
        contractAddress
      )

      set({
        currentLeaderboard,
      })
    } catch (error) {
      console.error(error)
    }
  },
  fetchOldLeaderBoard: async (contractAddress: string) => {
    try {
      const oldLeaderboard = await ArenaService.queries().fetchOldLeaderboard(contractAddress)

      set({
        oldLeaderboard,
      })
    } catch (error) {
      console.error(error)
    }
  },
  fetchWalletInfos: async (contractAddress: string) => {
    try {
      const walletInfos = await ArenaService.queries().fetchWalletInfos(contractAddress)

      set({
        walletInfos,
      })
    } catch (error) {
      console.error(error)
    }
  },
}))
