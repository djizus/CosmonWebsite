export enum SCARCITIES {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  DIVINITY = 'Divinity',
}

export const scarcities = [
  SCARCITIES.COMMON,
  SCARCITIES.UNCOMMON,
  SCARCITIES.RARE,
  SCARCITIES.EPIC,
  SCARCITIES.LEGENDARY,
  SCARCITIES.DIVINITY,
]

export type Scarcity = typeof scarcities[number]

export enum PERSONNALITY {
  AGGRESSIVE = 'Aggressive',
  FINANCIAL = 'Financial',
  EXPANSIVE = 'Expansive',
  CREATIVE = 'Creative',
  TACTICAL = 'Tactical',
  ERUDITE = 'Erudite',
  SPIRITUAL = 'Spiritual',
  DYNAMIC = 'Dynamic',
}

export const personnalities = [
  PERSONNALITY.AGGRESSIVE,
  PERSONNALITY.FINANCIAL,
  PERSONNALITY.EXPANSIVE,
  PERSONNALITY.CREATIVE,
  PERSONNALITY.TACTICAL,
  PERSONNALITY.ERUDITE,
  PERSONNALITY.SPIRITUAL,
  PERSONNALITY.DYNAMIC,
]

export type Personnality = typeof personnalities[number]

export enum GEOGRAPHICAL {
  EUROPA = 'Europa',
  ASIA = 'Asia',
  AFRICA = 'Africa & Middle-East',
}

export const geographicals = [GEOGRAPHICAL.EUROPA, GEOGRAPHICAL.ASIA, GEOGRAPHICAL.AFRICA]

export type Geographical = typeof geographicals[number]

export enum TIME {
  ANCIENT = 'Ancient history',
  MIDDLE = 'Middle age',
  MODERN = 'Modern history',
}

export const times = [TIME.ANCIENT, TIME.MIDDLE, TIME.MODERN]

export type Time = typeof times[number]
