import { Coin } from '@cosmjs/proto-signing'

export type ArenaType = {
  name: string
  contract: string
  arena_open: boolean
  arena_open_time: number // timestamp
  image_url: string
  price: Coin
  combat_price: Coin
  registeredIn: boolean
}

export type WalletInfos = {
  points: number
  defeats: number
  victories: number
  draws: number
  position: number | null
}

export type PrizesForAddress = {
  to_claim: Coin[]
  total: Coin[]
}

export type CurrentLeaderBoardItem = {
  address: string
  position: number
  points: number
  defeats: number
  draws: number
  victories: number
  fights: number
}

export type CurrentLeaderBoard = CurrentLeaderBoardItem[]

export type OldLeaderBoardItem = any
export type OldLeaderBoard = OldLeaderBoardItem[]
