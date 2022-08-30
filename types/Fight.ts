import { ArenaType } from './Arena'
import { CosmonType } from './Cosmon'

export type FightPlayerType = {
  identity: string
  deckName?: string
  cosmons: CosmonType[]
}

export type FightEventType = {
  turn: number
  miss: boolean
  atk_id: string
  def_id: string
  def_health: number
  damage: number
  critical: boolean
  action_point: number
}

export type FightType = {
  arena: ArenaType
  me: FightPlayerType
  opponent: FightPlayerType
  winner: Omit<FightPlayerType, 'cosmons'>
  events: FightEventType[]
}