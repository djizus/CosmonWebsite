import { CosmonType } from 'types/Cosmon'
import create from 'zustand'
import { AFFINITY_TYPES, Deck, DeckAffinitiesType, DeckId, NFTId } from 'types'
import { useWalletStore } from './walletStore'
import { toast } from 'react-toastify'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import ErrorIcon from '@public/icons/error.svg'
import SuccessIcon from '@public/icons/success.svg'
import { getCosmonPersonalityAffinity, getTrait } from '@utils/cosmon'
import { DeckService } from '@services/deck'
import { computeMalusForCosmons, deckHasMalus, getLowestCosmon } from '@utils/malus'
import { CosmonTypeWithMalus } from 'types/Malus'

interface DeckState {
  decksList: Deck[]
  fetchDecksList: () => any
  isFetchingDecksList: boolean
  personalityAffinities: any
  fetchPersonalityAffinities: () => any
  createDeck: (name: string, nftIds: NFTId[]) => any
  creatingDeck: boolean
  updateDeck: (deckId: DeckId, name: string, nftIds: NFTId[]) => any
  updatingDeck: boolean
  removeDeck: (deckId: DeckId) => any
  isRemovingDeck: boolean
  computeDeckAffinities: (nfts: CosmonTypeWithMalus[]) => DeckAffinitiesType
  refreshCosmonsAndDecksList: () => Promise<void>
}

export const useDeckStore = create<DeckState>((set, get) => ({
  decksList: [],
  personalityAffinities: null,
  creatingDeck: false,
  updatingDeck: false,
  isFetchingDecksList: false,
  isRemovingDeck: false,

  fetchDecksList: async () => {
    const { address, cosmons } = useWalletStore.getState()
    if (address && cosmons?.length > 0) {
      try {
        set({ isFetchingDecksList: true })
        let decks = [] as Deck[]
        const deckIdsList = await DeckService.queries().getDecksByAddr(address)

        if (deckIdsList && deckIdsList.length) {
          for (const deckId of deckIdsList) {
            const nftIdsList = await DeckService.queries().getNftsByDeckId(deckId)

            const deckName = await DeckService.queries().getName(deckId)

            if (nftIdsList?.length) {
              const nftsList = nftIdsList.map((nftId: string) => {
                return cosmons.find((cosmon: CosmonType) => cosmon.id === nftId)
              })

              const nftsListWithMalus = computeMalusForCosmons(nftsList)

              decks.push({
                id: deckId,
                cosmons: nftsListWithMalus,
                name: deckName,
                hasMalus: deckHasMalus(nftsListWithMalus),
              })
            }
          }
        }

        set({ decksList: decks, isFetchingDecksList: false })
        return decks
      } catch (error) {
        console.error(error)
      }
    }
  },
  createDeck: async (name: string, nftIds: NFTId[]) => {
    try {
      const { updateCosmonsAreInDeck } = useWalletStore.getState()
      set({ creatingDeck: true })
      const response = await toast
        .promise(DeckService.executes().createDeck(name, nftIds), {
          pending: {
            render() {
              return <ToastContainer type="pending">{`Creating "${name}"`}</ToastContainer>
            },
          },
          success: {
            render() {
              return (
                <ToastContainer type={'success'}>"{name}" created successfully,</ToastContainer>
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
          set({ decksList: [] })
          await updateCosmonsAreInDeck()
          set({ creatingDeck: false })
          return resp
        })
        .catch((e) => {
          console.error(e)
          set({ creatingDeck: false })
        })
      return response
    } catch (error) {}
  },
  updateDeck: async (deckId: DeckId, name: string, nftIds: NFTId[]) => {
    try {
      const { updateCosmonsAreInDeck } = useWalletStore.getState()
      set({ updatingDeck: true })
      const response = await toast
        .promise(DeckService.executes().updateDeck(deckId, name, nftIds), {
          pending: {
            render() {
              return <ToastContainer type="pending">{`Updating "${name}"`}</ToastContainer>
            },
          },
          success: {
            render() {
              return (
                <ToastContainer type={'success'}>"{name}" updated successfully,</ToastContainer>
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
          try {
            set({ decksList: [] })
            await updateCosmonsAreInDeck()
            set({ updatingDeck: false })
            return resp
          } catch (error) {
            console.error(error)
            set({ updatingDeck: false })
          }
        })
        .catch((e) => {
          console.error(e)
          set({ updatingDeck: false })
        })
      return response
    } catch (e) {}
  },
  fetchPersonalityAffinities: async () => {
    try {
      const personalityAffinities = await DeckService.queries().getPersonalityAffinities()
      set({ personalityAffinities })
    } catch (error) {
      console.error(error)
    }
  },
  computeDeckAffinities: (nfts: CosmonTypeWithMalus[]) => {
    const cosmons = nfts.reduce((acc: CosmonTypeWithMalus[], curr) => {
      if (curr) {
        const isCosmonAlreadyInDeck =
          acc.findIndex(
            (cosmon: CosmonTypeWithMalus) => cosmon.data.extension.name === curr.data.extension.name
          ) !== -1

        if (!isCosmonAlreadyInDeck) {
          return [...acc, curr]
        }
      }

      return acc
    }, [])

    // Geographical
    let geoAffinity: Set<NFTId> = new Set()
    for (let i = 0; i < cosmons.length; i++) {
      const cosmon = cosmons[i]
      const geoTrait = getTrait(cosmon, 'Geographical')

      for (let j = 0; j < cosmons.length; j++) {
        const cosmon2 = cosmons[j]
        if (i !== j && geoTrait === getTrait(cosmon2, 'Geographical')) {
          geoAffinity.add(cosmon.id)
        }
      }
    }

    // Time
    let timeAffinity: Set<NFTId> = new Set()
    for (let i = 0; i < cosmons.length; i++) {
      const cosmon = cosmons[i]
      const timeTrait = getTrait(cosmon, 'Time')

      for (let j = 0; j < cosmons.length; j++) {
        const cosmon2 = cosmons[j]
        if (i !== j && timeTrait === getTrait(cosmon2, 'Time')) {
          timeAffinity.add(cosmon.id)
        }
      }
    }

    // Personality
    let personalityAffinity: Set<NFTId[]> = new Set()
    for (let i = 0; i < cosmons.length; i++) {
      const cosmon = cosmons[i]
      const cosmonPersonalityAffinity = getCosmonPersonalityAffinity(cosmon)

      for (let j = 0; j < cosmons.length; j++) {
        const cosmon2 = cosmons[j]
        if (i !== j && cosmonPersonalityAffinity === getTrait(cosmon2, 'Personality')) {
          personalityAffinity.add([cosmon.id, cosmon2.id])
        }
      }
    }

    //Malus
    let malusAffinity: Set<NFTId> = new Set()
    for (let i = 0; i < cosmons.length; i++) {
      const cosmon = cosmons[i]

      if (cosmon.malusPercent < 0) {
        malusAffinity.add(cosmon.id)
      }
    }

    return {
      [AFFINITY_TYPES.GEOGRAPHICAL]: geoAffinity,
      [AFFINITY_TYPES.TIME]: timeAffinity,
      [AFFINITY_TYPES.PERSONALITY]: personalityAffinity,
      [AFFINITY_TYPES.MALUS]: malusAffinity,
    }
  },
  removeDeck: async (deckId: DeckId) => {
    try {
      const { updateCosmonsAreInDeck } = useWalletStore.getState()
      set({ isRemovingDeck: true })
      const response = await toast
        .promise(DeckService.executes().removeDeck(deckId), {
          pending: {
            render() {
              return <ToastContainer type="pending">{`Deleting the deck`}</ToastContainer>
            },
          },
          success: {
            render() {
              return (
                <ToastContainer type={'success'}>Deck was deleted successfully,</ToastContainer>
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
          try {
            set({ decksList: [] })
            await updateCosmonsAreInDeck()
            set({ isRemovingDeck: false })
            return resp
          } catch (error) {
            console.error(error)
          }
        })
      return response
    } catch (error) {
      console.error(error)
    }
  },
  refreshCosmonsAndDecksList: async () => {
    try {
      const { fetchCosmons, setCosmons } = useWalletStore.getState()
      setCosmons([])
      await fetchCosmons()
      set({ decksList: [] })
      const { fetchDecksList } = get()
      await fetchDecksList()
    } catch (error) {
      console.error(error)
    }
  },
}))
