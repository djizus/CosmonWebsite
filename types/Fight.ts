import { ArenaType } from './Arena'
import { CosmonTypeWithMalus } from './Malus'

export type FightPlayerType = {
  identity: string
  deckName?: string
  cosmons: CosmonTypeWithMalus[]
  cosmonsWithoutBonus: CosmonTypeWithMalus[]
  deckScore: number
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
  action_type?: FightEventActionType
  heal: number
  heal_target_id: string
}

export enum FightEventActionType {
  HIT,
  HEAL,
}

export type FightType = {
  arena: ArenaType
  me: FightPlayerType
  opponent: FightPlayerType & {
    isBot: boolean
  }
  winner: Omit<FightPlayerType, 'cosmons' | 'cosmonsWithoutBonus' | 'deckScore'>
  events: FightEventType[]
}
