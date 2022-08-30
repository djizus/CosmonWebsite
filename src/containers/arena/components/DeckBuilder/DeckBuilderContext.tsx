import { Deck, CosmonType, Scarcity } from 'types'
import React from 'react'

export type NftsListFilter = {
  search: string
  showStats: boolean
  showUnused: boolean
  scarcities: Scarcity[]
}

export const DeckBuilderContext = React.createContext({
  deckName: '',
  setDeckName: (name: string) => {},
  nfts: [] as CosmonType[],
  setNfts: (nfts: CosmonType[]) => {},
  affinities: [],
  setAffinities: (affinities: any[]) => {},
  listFilter: {} as NftsListFilter,
  setListFilter: (listFilter: NftsListFilter) => {},
  deck: [] as (CosmonType | undefined)[],
  setDeck: (nfts: CosmonType[]) => {},
  deckToEdit: {} as Deck | undefined,
  handleCloseModal: () => {},
})
