import { ToastContainer } from '@components/ToastContainer/ToastContainer'
import { GameService } from '@services/game'
import { toast } from 'react-toastify'
import ErrorIcon from '@public/icons/error.svg'
import SuccessIcon from '@public/icons/success.svg'
import create from 'zustand'
import { Deck, ArenaType, FightType } from 'types'

interface GameState {
  arenasList: ArenaType[]
  fetchArenasList: () => Promise<ArenaType[] | undefined>
  registratingToArena: boolean
  registerToArena: (arena: ArenaType) => Promise<ArenaType[] | undefined>
  generatingBattle: boolean
  fight: (deck: Deck, arena: ArenaType) => Promise<any>
  battle: FightType | null
}

export const useGameStore = create<GameState>((set, get) => ({
  arenasList: [],
  registratingToArena: false,
  generatingBattle: false,
  battle: null,

  fetchArenasList: async () => {
    try {
      const arenasListTemp = await GameService.queries().getArenas()

      const registeredArenasList = await GameService.queries().getRegistredArenasForWallet()

      const arenasList =
        arenasListTemp?.map((arena) => ({
          ...arena,
          registeredIn:
            registeredArenasList?.findIndex(
              (registeredArena) => registeredArena.name === arena.name
            ) === -1
              ? false
              : true,
        })) || []

      set({ arenasList })
      return arenasList
    } catch (error) {
      console.error(error)
    }
  },
  registerToArena: async (arena: ArenaType) => {
    try {
      set({ registratingToArena: true })
      const response = await toast
        .promise(GameService.executes().registerToArena(arena), {
          pending: {
            render() {
              return (
                <ToastContainer type="pending">
                  {`Please wait while registrating to the arena`}
                </ToastContainer>
              )
            },
          },
          success: {
            render() {
              return (
                <ToastContainer type={'success'}>
                  Great! The arena is waiting for you
                </ToastContainer>
              )
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
        .then(async (resp: any) => {
          // Refresh arenas list with fresh data
          const refreshedArenasList = await get().fetchArenasList()
          set({ registratingToArena: false })
          return refreshedArenasList
        })
      return response
    } catch (error) {}
  },
  fight: async (deck: Deck, arena: ArenaType) => {
    try {
      set({ generatingBattle: true })
      const battle = await toast
        .promise(GameService.executes().fight(deck, arena), {
          pending: {
            render() {
              return (
                <ToastContainer type="pending">
                  {`Please wait while registrating to a fight`}
                </ToastContainer>
              )
            },
          },
          success: {
            render() {
              return (
                <ToastContainer type={'success'}>
                  Prepare yourself! The battle is about to begin ⚔️
                </ToastContainer>
              )
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
        .then(async (resp: any) => {
          return resp
        })
      set({ generatingBattle: false, battle })
      return battle
    } catch (error) {}
  },
}))
