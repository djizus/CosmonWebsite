import { CosmonType, CosmonTypeWithBoosts } from 'types/Cosmon'

export type DeckId = number
export type NFTId = string

export type Deck = {
  id: number
  cosmons: CosmonType[]
  name: string
}

export type DeckWithBoosts = {
  id: number
  name: string
  cosmons: CosmonTypeWithBoosts[]
}

export enum AFFINITY_TYPES {
  PERSONALITY = 'Personality',
  GEOGRAPHICAL = 'Geographical',
  TIME = 'Time',
}

export type DeckAffinitiesType = {
  [AFFINITY_TYPES.GEOGRAPHICAL]?: Set<NFTId>
  [AFFINITY_TYPES.PERSONALITY]?: Set<NFTId[]>
  [AFFINITY_TYPES.TIME]?: Set<NFTId>
}
