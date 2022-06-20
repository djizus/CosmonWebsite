export const scarcities = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
  'Divinity',
] as const

export type Scarcity = typeof scarcities[number]
