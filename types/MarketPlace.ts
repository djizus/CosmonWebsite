import { Geographical, PERSONNALITY, Personnality, Scarcity, Time } from 'types'

export interface PriceFilterType {
  min: string
  max: string
}
export interface LevelFilterType {
  min: string
  max: string
}
export type PersonnalityFilterType = Personnality[]
export type TimeFilterType = Time[]
export type GeographicalFilterType = Geographical[]
export type ScarcityFilterType = Scarcity[]

export interface MarketPlaceFilters {
  name: string
  id: number
  price: PriceFilterType
  levels: LevelFilterType
  scarcity: ScarcityFilterType
  personnality: PersonnalityFilterType
  time: TimeFilterType
  geographical: GeographicalFilterType
}

export type MarketplaceSortOrder = 'high_to_low' | 'low_to_high'

export interface SellData {
  price: number
  address: string
  nft: string
  collection: string
  expire: any
  level: number
  personality: Personnality
  geo: Geographical
  time: Time
  scarcity: Scarcity
}

export type SellOffset =
  | {
      token_id: string
      price: string
      level?: number
    }
  | undefined

export interface FetchByPricePaginationOptions {
  start_after: SellOffset
  limit: number
  price: number
}

export interface FetchByPriceRangePaginationOptions {
  start_after: SellOffset
  limit: number
  min_price: number
  max_price: number
}

export interface FetchByLevelPaginationOptions {
  start_after: SellOffset
  limit: number
  level: number
}

export interface FetchByLevelRangePaginationOptions {
  start_after: SellOffset
  limit: number
  level_min: number
  level_max: number
}

export interface FetchByPersonalityPaginationOptions {
  start_after: SellOffset
  limit: number
  personnality: Personnality
}

export interface FetchByGeoPaginationOptions {
  start_after: SellOffset
  limit: number
  geo: Geographical
}

export interface FetchByTimePaginationOptions {
  start_after: SellOffset
  limit: number
  time: Time
}

export interface FetchByScarcityPaginationOptions {
  start_after: SellOffset
  limit: number
  scarcity: Scarcity
}

export interface FetchByIdPaginationOptions {
  start_after: SellOffset
  limit: number
  asset_id: number
}
