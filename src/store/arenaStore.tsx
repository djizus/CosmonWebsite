import create from 'zustand'
import { ArenaService } from '@services/arena'
import { Coin } from '@cosmjs/proto-signing'

interface ArenaState {
  fetchArenaFees: (contractAddress: string) => Promise<Coin[]>
  fetchCurrentPrizePool: (contractAddress: string) => Promise<Coin[]>
  fetchNextPrizePool: (contractAddress: string) => Promise<Coin[]>
  fetchPrizesForAddress: (contractAddress: string) => Promise<Coin[]>
  loading: boolean
}

export const useArenaStore = create<ArenaState>((set, get) => ({
  arenaFees: null,
  currentPrizePool: null,
  nextPrizePool: null,
  prizesForAddress: null,
  loading: false,

  fetchArenaFees: async (contractAddress: string) => {
    try {
      const arenaFees = await ArenaService.queries().fetchArenaFees(contractAddress)
      return arenaFees
    } catch (error) {
      console.error(error)
    }
  },
  fetchCurrentPrizePool: async (contractAddress: string) => {
    try {
      const currentPrizePool = await ArenaService.queries().fetchCurrentPrizePool(contractAddress)
      return currentPrizePool
    } catch (error) {
      console.error(error)
    }
  },
  fetchNextPrizePool: async (contractAddress: string) => {
    try {
      const nextPrizePool = await ArenaService.queries().fetchNextPrizePool(contractAddress)
      return nextPrizePool
    } catch (error) {
      console.error(error)
    }
  },
  fetchPrizesForAddress: async (contractAddress: string) => {
    try {
      const prizesForAddress = await ArenaService.queries().fetchPrizesForAddress(contractAddress)
      return prizesForAddress
    } catch (error) {
      console.error(error)
    }
  },
}))
