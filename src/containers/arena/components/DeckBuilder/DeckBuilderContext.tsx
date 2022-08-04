import { Deck } from '@services/deck'
import React from 'react'
import { CosmonType } from 'types/Cosmon'
import { Scarcity } from 'types/Scarcity'

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
