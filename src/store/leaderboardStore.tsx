import create from 'zustand'
import { Coin } from '@cosmjs/proto-signing'

interface LeaderBoardState {
  fetchEarnings: (contractAddress: string) => Promise<Coin[]>
  loading: boolean
}

export const useLeaderboardStore = create<LeaderBoardState>((set, get) => ({
  fetchEarnings: null,
  loading: false,

  fetchEarnings: async (contractAddress: string) => {
    try {
      const earnings = '1000'

      return earnings as any
    } catch (error) {
      console.error(error)
    }
  },
}))
