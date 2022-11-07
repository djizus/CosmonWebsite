import { Boost } from './Boost'

export type CosmonTraitType =
  | 'scarcity'
  | 'asset_id'
  | 'Short Description'
  | 'Time'
  | 'Geographical'
  | 'Personality'
  | 'Nationality'

export type CosmonStatKeyType =
  | 'Xp'
  | 'Level'
  | 'Hp'
  | 'Atq'
  | 'Def'
  | 'Spe'
  | 'Psy'
  | 'Luk'
  | 'Int'
  | 'Fp'
  | 'Fp Max'
  | 'Next Level'
  | 'Floor Level'
  | 'Ap'

export type CosmonStatType = {
  key: CosmonStatKeyType
  value: string
}

export type CosmonType = {
  id: string
  isInDeck?: boolean
  temporaryFree?: boolean // useful during the edition of deck, when we remove an nft from the deck before saving
  data: {
    extension: {
      animation_url: null
      attributes: {
        display_type: any
        trait_type: CosmonTraitType
        value: string
      }[]
      background_color: any
      description: string
      external_url: any
      image: string
      image_data: any
      name: string
      youtube_url: string
    }
    token_uri: null
  }
  stats?: CosmonStatType[]
}

export type CosmonTypeWithBoosts = CosmonType & {
  boosts: [Boost | null, Boost | null, Boost | null]
}
