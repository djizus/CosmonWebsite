import { Coin } from '@cosmjs/proto-signing'

export type ArenaType = {
  name: string
  contract: string
  arena_open: boolean
  image_url: string
  price: Coin
  registeredIn: boolean
}
