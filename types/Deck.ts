import { CosmonTypeWithMalus } from './Malus'

export type DeckId = number
export type NFTId = string

export type Deck = {
  id: number
  cosmons: CosmonTypeWithMalus[]
  name: string
  hasMalus: boolean
}

export type DeckWithoutCosmons = Omit<Deck, 'cosmons'> & {
  cosmons: (CosmonTypeWithMalus | undefined)[]
}

export enum AFFINITY_TYPES {
  PERSONALITY = 'Personality',
  GEOGRAPHICAL = 'Geographical',
  TIME = 'Time',
  MALUS = 'Malus',
}

export type DeckAffinitiesType = {
  [AFFINITY_TYPES.GEOGRAPHICAL]?: Set<NFTId>
  [AFFINITY_TYPES.PERSONALITY]?: Set<NFTId[]>
  [AFFINITY_TYPES.TIME]?: Set<NFTId>
  [AFFINITY_TYPES.MALUS]?: Set<NFTId>
}
