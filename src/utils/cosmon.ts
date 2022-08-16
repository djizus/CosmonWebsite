import { useDeckStore } from '@store/deckStore'
import {
  CosmonStatKeyType,
  CosmonStatType,
  CosmonTraitType,
  CosmonType,
} from '../../types/Cosmon'
import { scarcities, Scarcity } from '../../types/Scarcity'

export function getScarcityByCosmon(cosmon: CosmonType): Scarcity | null {
  let scarcity = null
  cosmon.data.extension.attributes.forEach((attribute) => {
    if (attribute.trait_type === 'scarcity') {
      scarcity = attribute.value as Scarcity
      return scarcity
    }
  })
  return scarcity
}

export function getCosmonStat(
  stats: CosmonStatType[],
  keyType: CosmonStatKeyType
): CosmonStatType | undefined {
  return stats.find((stat) => stat.key === keyType)
}

export function getTrait(cosmon: CosmonType, traitType: CosmonTraitType) {
  return cosmon.data.extension.attributes.find(
    (attr) => attr.trait_type === traitType
  )?.value
}

export function getScarcitiesNumberByCosmons(cosmons: CosmonType[]): {
  key: Scarcity
  count: number
}[] {
  const arrayOfScarcities = cosmons.map((c) => getScarcityByCosmon(c))

  const cosmonScarcityCounter = Array.from(
    arrayOfScarcities.reduce(
      (r, c) => r.set(c, (r.get(c) || 0) + 1),
      new Map()
    ),
    ([key, count]) => ({ key, count })
  )
  return cosmonScarcityCounter
}

export function sortCosmonsByScarcity(cosmonsList: CosmonType[]) {
  let r: CosmonType[] = []
  for (const scarcity of [...scarcities].reverse()) {
    for (const cosmon of cosmonsList) {
      if (getScarcityByCosmon(cosmon) === scarcity) {
        r = [...r, cosmon]
      }
    }
  }
  return r
}

export function getCosmonPersonalityAffinity(cosmon: CosmonType) {
  const { personalityAffinities } = useDeckStore.getState()
  const cosmonPersonality = getTrait(cosmon, 'Personality')

  const matchingPersonality = personalityAffinities
    ?.filter(([lookingForPersonality, _matching]: [string, string]) => {
      return cosmonPersonality === lookingForPersonality
    })
    .flat()[1]

  return matchingPersonality
}
