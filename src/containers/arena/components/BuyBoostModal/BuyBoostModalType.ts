import { CosmonType } from 'types'
import { Boost } from 'types/Boost'

export type CurrentView = 'boost' | 'leader' | 'recap'

export type BuyBoostModalOrigin = 'buyBoost' | CosmonType

export type CosmonTypeWithDecks = CosmonType & {
  deckName: string
  deckId: number
}
