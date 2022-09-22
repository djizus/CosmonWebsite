import { Coin } from '@cosmjs/proto-signing'

export type ArenaType = {
  name: string
  contract: string
  arena_open: boolean
  arena_open_time: number // timestamp
  image_url: string
  price: Coin
  registeredIn: boolean
}
