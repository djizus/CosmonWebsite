import { CosmonType } from '../../types/Cosmon'
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
