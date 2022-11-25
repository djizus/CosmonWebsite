import { Deck, CosmonType, Scarcity, DeckWithoutCosmons } from 'types'
import React from 'react'

export type NftsListFilter = {
  search: string
  showStats: boolean
  showUnused: boolean
  scarcities: Scarcity[]
}

export const DeckBuilderContext = React.createContext({
  nfts: [] as CosmonType[],
  setNfts: (nfts: CosmonType[]) => {},
  affinities: [],
  setAffinities: (affinities: any[]) => {},
  listFilter: {} as NftsListFilter,
  setListFilter: (listFilter: NftsListFilter) => {},
  deck: {} as Deck | DeckWithoutCosmons,
  setDeck: (deck: Deck | DeckWithoutCosmons) => {},
  deckToEdit: {} as Deck | undefined,
  handleCloseModal: () => {},
})
