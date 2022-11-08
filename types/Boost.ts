import { Coin } from '@cosmjs/proto-signing'
import { CosmonStatKeyType } from './Cosmon'

export enum BOOSTS {
  ELIXIR = 'Elixir',
  MEGAELIXIR = 'Megaelixir',
  POWER = 'Power Plus',
  DEFENSE = 'Defense Plus',
  SPEED = 'Speed Plus',
  MIND = 'Mind Plus',
  LUCK = 'Luck Plus',
}

export const boosts = [
  BOOSTS.ELIXIR,
  BOOSTS.MEGAELIXIR,
  BOOSTS.POWER,
  BOOSTS.DEFENSE,
  BOOSTS.SPEED,
  BOOSTS.LUCK,
] as const

export interface Boost {
  boost_name: CosmonStatKeyType
  effect_time: number
  inc_value: number
  price: Coin
  image_path: string
}

export interface BoostForCosmon {
  id: string
  boosts: (Boost | null)[]
}
