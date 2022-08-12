import { Deck } from '@services/deck'

export type FightModeType = 'training' | 'league'

export type FightModeRequestType = {
  fightMode: FightModeType
  active: boolean
}

export type FightRequestType = {
  fightMode: FightModeType
  deck: Deck
}
