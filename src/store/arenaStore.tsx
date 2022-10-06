import create from 'zustand'
import { ArenaService } from '@services/arena'
import { Coin } from '@cosmjs/proto-signing'
import { WalletInfos, PrizesForAddress, CurrentLeaderBoard, OldLeaderBoard } from 'types'
import { toast } from 'react-toastify'
import { ToastContainer } from '@components/ToastContainer/ToastContainer'
import SuccessIcon from '@public/icons/success.svg'
import ErrorIcon from '@public/icons/error.svg'

interface ArenaState {
  oldLeaderboard: OldLeaderBoard
  currentLeaderboard: CurrentLeaderBoard
  walletInfos: WalletInfos
  arenaFees: any
  currentPrizePool: any
  nextPrizePool: any
  prizesForAddress: PrizesForAddress
  fetchArenaFees: (arenaAddress: string) => Promise<Coin[]>
  fetchCurrentPrizePool: (arenaAddress: string) => Promise<Coin[]>
  fetchNextPrizePool: (arenaAddress: string) => Promise<Coin[]>
  fetchPrizesForAddress: (arenaAddress: string) => Promise<Coin[]>
  fetchCurrentLeaderBoard: (arenaAddress: string) => void
  fetchOldLeaderBoard: (arenaAddress: string) => void
  fetchWalletInfos: (arenaAddress: string, walletAddress: string) => void
  fetchWalletsInfos: (arenaAddress: string, walletsAddress: string[]) => void
  claimPrize: (arenaAddress: string) => void
  loading: boolean
}

export const useArenaStore = create<ArenaState>((set, get) => ({
  oldLeaderboard: [],
  currentLeaderboard: [],
  walletInfos: {
    points: 0,
    defeats: 0,
    victories: 0,
  },
  arenaFees: null,
  currentPrizePool: null,
  nextPrizePool: null,
  prizesForAddress: {
    to_claim: [],
    total: [],
  },
  loading: false,

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

      set({
        currentPrizePool,
      })
      return currentPrizePool
    } catch (error) {
      console.error(error)
    }
  },
  fetchNextPrizePool: async (arenaAddress: string) => {
    try {
      const nextPrizePool = await ArenaService.queries().fetchNextPrizePool(arenaAddress)

      set({
        nextPrizePool,
      })
      return nextPrizePool
    } catch (error) {
      console.error(error)
    }
  },
  fetchPrizesForAddress: async (arenaAddress: string) => {
    try {
      const prizesForAddress = await ArenaService.queries().fetchPrizesForAddress(arenaAddress)

      set({
        prizesForAddress,
      })

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
      const addressesFromLeaderboard: string[] = currentLeaderboard
        .reverse()
        .reduce((acc: string[], curr: string[]) => {
          if (curr.length > 0) {
            return [...acc, ...curr]
          }

          return [...acc]
        }, [])

      const walletsInfos = await ArenaService.queries().fetchWalletsInfos(
        arenaAddress,
        addressesFromLeaderboard
      )

      const formatedLeaderboard: CurrentLeaderBoard = addressesFromLeaderboard.reduce(
        (acc: CurrentLeaderBoard, curr: string, index: number) => {
          if (walletsInfos[index]) {
            return [
              ...acc,
              {
                address: curr,
                position: index + 1,
                fights: walletsInfos[index].victories + walletsInfos[index].defeats,
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

      set({
        oldLeaderboard,
      })
    } catch (error) {
      console.error(error)
    }
  },
  fetchWalletInfos: async (arenaAddress: string, walletAddress: string) => {
    try {
      const walletInfos = await ArenaService.queries().fetchWalletInfos(arenaAddress, walletAddress)

      set({
        walletInfos,
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
      await toast.promise(ArenaService.executes().claimPrize(arenaAddress), {
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

      const prizesForAddress = await ArenaService.queries().fetchPrizesForAddress(arenaAddress)

      set({
        prizesForAddress: prizesForAddress,
      })
    } catch (error) {
      console.error(error)
    }
  },
}))
