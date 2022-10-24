import create from 'zustand'
import { ArenaService } from '@services/arena'
import { Coin } from '@cosmjs/proto-signing'
import { WalletInfos, PrizesForAddress, LeaderBoard, ArenaType } from 'types'
import { toast } from 'react-toastify'
import { ToastContainer } from '@components/ToastContainer/ToastContainer'
import SuccessIcon from '@public/icons/success.svg'
import ErrorIcon from '@public/icons/error.svg'
import { getNextMonday } from '@utils/date'
import { useWalletStore } from './walletStore'
import { XPRegistryService } from '@services/xp-registry'

interface ArenaState {
  currentLeaguePro: ArenaType | null
  oldLeaderboard: LeaderBoard
  currentLeaderboard: LeaderBoard
  walletInfos: WalletInfos
  arenaFees: any
  currentPrizePool: any
  nextPrizePool: any
  prizePool: Coin | null
  prizesForAddress: PrizesForAddress
  currentChampionshipNumber: number
  dailyCombatLimit: number
  maxDailyCombatLimit: number
  fetchArenaFees: (arenaAddress: string) => Promise<Coin[]>
  fetchCurrentPrizePool: (arenaAddress: string) => Promise<Coin[]>
  fetchNextPrizePool: (arenaAddress: string) => Promise<Coin[]>
  fetchPrizesForAddress: (arenaAddress: string) => Promise<Coin[]>
  fetchCurrentChampionshipNumber: (arenaAddress: string) => void
  fetchCurrentLeaderBoard: (arenaAddress: string) => void
  fetchOldLeaderBoard: (arenaAddress: string) => void
  fetchWalletInfos: (arenaAddress: string, walletAddress: string) => void
  fetchWalletsInfos: (arenaAddress: string, walletsAddress: string[]) => void
  fetchDailyCombat: (arenaAddress: string, walletAddress: string) => void
  fetchMaxDailyCombat: (arenaAddress: string) => void
  claimPrize: (arenaAddress: string) => void
  fetchRankForAddress: (arenaAddress: string, walletAddress: string) => void
  getNextLeagueOpenTime: () => Date
  getPrizePool: (arenaAddress: string) => void
  setCurrentLeaguePro: (leaguePro: ArenaType) => void
  loading: boolean
  hourlyFPNumber: number
  fetchHourlyFPNumber: () => void
}

export const WINNER_IS_DRAW = 'DRAW'

export const useArenaStore = create<ArenaState>((set, get) => ({
  currentLeaguePro: null,
  oldLeaderboard: [],
  currentLeaderboard: [],
  dailyCombatLimit: 0,
  maxDailyCombatLimit: 0,
  walletInfos: {
    points: 0,
    defeats: 0,
    victories: 0,
    draws: 0,
    position: null,
  },
  currentChampionshipNumber: 1,
  arenaFees: null,
  currentPrizePool: null,
  nextPrizePool: null,
  prizePool: null,
  prizesForAddress: {
    to_claim: [],
    total: [],
  },
  loading: false,
  hourlyFPNumber: 0,

  fetchArenaFees: async (arenaAddress: string) => {
    try {
      const arenaFees = await ArenaService.queries().fetchArenaFees(arenaAddress)

      set({
        arenaFees,
      })
      return arenaFees
    } catch (error) {
      console.error(error)
    }
  },
  fetchCurrentPrizePool: async (arenaAddress: string) => {
    try {
      const currentPrizePool = await ArenaService.queries().fetchCurrentPrizePool(arenaAddress)
      set({ currentPrizePool })
      return currentPrizePool
    } catch (error) {
      console.error(error)
    }
  },
  fetchNextPrizePool: async (arenaAddress: string) => {
    try {
      const nextPrizePool = await ArenaService.queries().fetchNextPrizePool(arenaAddress)
      set({ nextPrizePool })
      return nextPrizePool
    } catch (error) {
      console.error(error)
    }
  },
  getPrizePool: async (arenaAddress: string) => {
    const { fetchCurrentPrizePool, fetchNextPrizePool } = get()
    const currPrize = await fetchCurrentPrizePool(arenaAddress)
    if (currPrize?.length > 0) {
      set({ prizePool: currPrize[0] })
    }
    const nextPrize = await fetchNextPrizePool(arenaAddress)
    if (nextPrize?.length > 0) {
      set({ prizePool: nextPrize[0] })
    }
  },
  fetchPrizesForAddress: async (arenaAddress: string) => {
    try {
      const prizesForAddress = await ArenaService.queries().fetchPrizesForAddress(arenaAddress)
      set({ prizesForAddress })
      return prizesForAddress
    } catch (error) {
      console.error(error)
    }
  },
  fetchCurrentLeaderBoard: async (arenaAddress: string) => {
    try {
      // @TODO handle pagination later
      const currentLeaderboard = await ArenaService.queries().fetchCurrentLeaderboard(
        arenaAddress,
        10,
        null
      )

      // @TODO : check with back if we rly need to reverse currentLeaderboard
      const addressesFromLeaderboard: string[] = [...currentLeaderboard].reduce(
        (acc: string[], curr: string[]) => {
          if (curr.length > 0) {
            return [...acc, ...curr]
          }

          return [...acc]
        },
        []
      )

      const walletsInfos = await ArenaService.queries().fetchWalletsInfos(
        arenaAddress,
        addressesFromLeaderboard
      )

      const formatedLeaderboard: LeaderBoard = addressesFromLeaderboard.reduce(
        (acc: LeaderBoard, curr: string, index: number) => {
          if (walletsInfos[index]) {
            return [
              ...acc,
              {
                address: curr,
                position: index + 1,
                fights:
                  walletsInfos[index].victories +
                  walletsInfos[index].defeats +
                  walletsInfos[index].draws,
                ...walletsInfos[index],
              },
            ]
          }

          return acc
        },
        []
      )

      set({
        currentLeaderboard: formatedLeaderboard,
      })
    } catch (error) {
      console.error(error)
    }
  },
  fetchOldLeaderBoard: async (arenaAddress: string) => {
    try {
      const oldLeaderboard = await ArenaService.queries().fetchOldLeaderboard(arenaAddress)

      const formatedOldLeaderboard: LeaderBoard = oldLeaderboard.map((item: any, index: number) => {
        return {
          address: item[0],
          position: index + 1,
          fights: item[1].victories + item[1].defeats + item[1].draws,
          ...item[1],
        }
      })

      set({
        oldLeaderboard: formatedOldLeaderboard,
      })
    } catch (error) {
      console.error(error)
    }
  },
  fetchWalletInfos: async (arenaAddress: string, walletAddress: string) => {
    try {
      const walletInfos = await ArenaService.queries().fetchWalletInfos(arenaAddress, walletAddress)
      if (!walletInfos) return
      const position = await ArenaService.queries().fetchRankForAddress(arenaAddress, walletAddress)
      set({
        walletInfos: {
          ...walletInfos,
          position: position ?? null,
        },
      })
    } catch (error) {
      console.error(error)
    }
  },
  fetchWalletsInfos: async (arenaAddress: string, walletsAddress: string[]) => {
    try {
      const walletInfos = await ArenaService.queries().fetchWalletsInfos(
        arenaAddress,
        walletsAddress
      )

      // @TODO define later
      // set({
      //   walletInfos,
      // })
    } catch (error) {
      console.error(error)
    }
  },
  claimPrize: async (arenaAddress: string) => {
    try {
      set({ loading: true })
      await toast
        .promise(ArenaService.executes().claimPrize(arenaAddress), {
          pending: {
            render() {
              return <ToastContainer type="pending">Claiming your rewards</ToastContainer>
            },
          },
          success: {
            render() {
              return <ToastContainer type={'success'}>Rewards successfully claimed</ToastContainer>
            },
            icon: SuccessIcon,
          },
          error: {
            render({ data }: any) {
              return <ToastContainer type="error">{data.message}</ToastContainer>
            },
            icon: ErrorIcon,
          },
        })
        .then(async () => {
          const { fetchWalletData } = useWalletStore.getState()
          const prizesForAddress = await ArenaService.queries().fetchPrizesForAddress(arenaAddress)
          fetchWalletData()
          set({
            prizesForAddress,
            loading: false,
          })
        })
        .catch(() => {
          set({ loading: false })
        })
    } catch (error) {
      console.error(error)
    }
  },
  fetchRankForAddress: async (arenaAddress: string, walletAddress: string) => {
    try {
      const rank = await ArenaService.queries().fetchRankForAddress(arenaAddress, walletAddress)
    } catch (error) {
      console.error(error)
    }
  },
  fetchCurrentChampionshipNumber: async (arenaAddress: string) => {
    try {
      const { currentChampionshipNumber } = get()
      const champNum = await ArenaService.queries().fetchCurrentChampionshipNumber(arenaAddress)
      set({ currentChampionshipNumber: champNum ?? currentChampionshipNumber })
    } catch (error) {
      console.error(error)
    }
  },
  getNextLeagueOpenTime: () => {
    const d = new Date()
    d.setUTCHours(16)
    d.setMinutes(0)
    d.setSeconds(0)
    return getNextMonday(d)
  },
  fetchHourlyFPNumber: async () => {
    const hourlyFPNumber = await XPRegistryService.queries().fecthHourlyFpNumber()
    set({ hourlyFPNumber })
  },
  fetchDailyCombat: async (arenaAddress: string, walletAddress: string) => {
    try {
      const dailyCombatLimit = await ArenaService.queries().fetchDailyCombat(
        arenaAddress,
        walletAddress
      )
      set({
        dailyCombatLimit,
      })
    } catch (error) {
      console.error(error)
    }
  },
  fetchMaxDailyCombat: async (arenaAddress: string) => {
    try {
      const maxDailyCombatLimit = await ArenaService.queries().fetchMaxDailyCombat(arenaAddress)
      set({
        maxDailyCombatLimit,
      })
    } catch (error) {
      console.error(error)
    }
  },
  setCurrentLeaguePro: (leaguePro: ArenaType) => {
    set({
      currentLeaguePro: leaguePro,
    })
  },
}))
