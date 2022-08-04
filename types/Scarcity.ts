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
] as const

export type Scarcity = typeof scarcities[number]
