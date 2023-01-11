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

export interface FetchAllSellingNftOptions {
  start_after: SellOffset
  limit?: number
  order: MarketplaceSortOrder
}

export interface FetchSellingNftFromAddressOptions {
  start_after: SellOffset
  limit?: number
  address: string
  order: MarketplaceSortOrder
}

export interface FetchByPricePaginationOptions {
  start_after: SellOffset
  limit?: number
  price: number
}

export interface FetchByPriceRangePaginationOptions {
  start_after: SellOffset
  limit?: number
  min_price: number
  max_price: number
  order: MarketplaceSortOrder
}

export interface FetchByLevelPaginationOptions {
  start_after: SellOffset
  limit?: number
  level: number
  order: MarketplaceSortOrder
}

export interface FetchByLevelRangePaginationOptions {
  start_after: SellOffset
  limit?: number
  level_min: number
  level_max: number
  order: MarketplaceSortOrder
}

export interface FetchByPersonalityPaginationOptions {
  start_after: SellOffset
  limit?: number
  personnality: Personnality
  order: MarketplaceSortOrder
}

export interface FetchByGeoPaginationOptions {
  start_after: SellOffset
  limit?: number
  geo: Geographical
  order: MarketplaceSortOrder
}

export interface FetchByTimePaginationOptions {
  start_after: SellOffset
  limit?: number
  time: Time
  order: MarketplaceSortOrder
}

export interface FetchByScarcityPaginationOptions {
  start_after: SellOffset
  limit?: number
  scarcity: Scarcity
  order: MarketplaceSortOrder
}

export interface FetchByIdPaginationOptions {
  start_after: SellOffset
  limit?: number
  asset_id: number
  order: MarketplaceSortOrder
}
