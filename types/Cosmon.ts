export type CosmonTraitType =
  | 'scarcity'
  | 'asset_id'
  | 'Short Description'
  | 'Time'
  | 'Geographical'
  | 'Personality'

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

export type CosmonStatType = {
  key: CosmonStatKeyType
  value: number
}

export type CosmonType = {
  id: string
  isInDeck: boolean
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
  stats: CosmonStatType[]
}
