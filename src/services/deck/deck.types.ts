import { CosmonType } from 'types/Cosmon'

export type DeckId = number
export type NFTId = string

export type Deck = {
  id: number
  cosmons: CosmonType[]
  name: string
}

export enum AFFINITY_TYPES {
  PERSONALITY = 'Personality',
  GEOGRAPHICAL = 'Geographical',
  TIME = 'Time',
}

export type DeckAffinities = {
  [AFFINITY_TYPES.GEOGRAPHICAL]?: Set<NFTId>
  [AFFINITY_TYPES.PERSONALITY]?: Set<NFTId[]>
  [AFFINITY_TYPES.TIME]?: Set<NFTId>
}
