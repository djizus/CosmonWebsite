import { AFFINITY_TYPES, CosmonStatType, CosmonType, DeckAffinitiesType } from 'types'
import { getCosmonStat } from '@utils/cosmon'
import { CosmonTypeWithMalus } from 'types/Malus'

export const StatsKeyCanHaveMalus: string[] = ['Atq', 'Def', 'Spe', 'Hp', 'Luk', 'Int']

export function deckHasMalus(cosmons: (CosmonTypeWithMalus | undefined)[]): boolean {
  return cosmons.some((cosmon) => (cosmon?.malusPercent ?? 0 < 0 ? true : false))
}

export function getOnlyCosmonsWithMalus(cosmons: CosmonTypeWithMalus[]): CosmonTypeWithMalus[] {
  return cosmons.filter((cosmon) => cosmon?.malusPercent < 0)
}

export function getLowestCosmon(
  cosmons: (CosmonType | CosmonTypeWithMalus)[]
): CosmonType | CosmonTypeWithMalus {
  return cosmons.reduce((acc: CosmonType | CosmonTypeWithMalus | undefined, curr) => {
    if (acc) {
      const accLvl: string | undefined = getCosmonStat(acc.stats, 'Level')?.value
      const currLvl = getCosmonStat(curr.stats, 'Level')?.value

      if (accLvl && currLvl) {
        return parseInt(accLvl) > parseInt(currLvl) ? curr : acc
      }
    }

    return curr
  })
}

export function computeStatsWithMalus(
  cosmon: CosmonType,
  lowestCosmon: CosmonType
): CosmonStatType[] {
  return cosmon.stats.map((stat) => {
    const lowestCosmonStat = getCosmonStat(lowestCosmon.stats, stat.key)

    if (lowestCosmonStat && StatsKeyCanHaveMalus.includes(stat.key)) {
      return {
        ...stat,
        value: (
          parseInt(stat.value) -
          Math.trunc((parseInt(stat.value) - parseInt(lowestCosmonStat.value)) * 0.8)
        ).toString(),
      }
    }

    return stat
  })
}

export function getCosmonPower(stats: CosmonStatType[]): number {
  return stats.reduce((acc, stat) => {
    if (stat && StatsKeyCanHaveMalus.includes(stat.key)) {
      return acc + parseInt(stat.value)
    }

    return acc
  }, 0)
}

export function computeCosmonMalusPercent(
  stats: CosmonStatType[],
  statsWithMalus: CosmonStatType[]
): number {
  const cosmonPowerWithoutMalus = getCosmonPower(stats)
  const cosmonPowerWithMalus = getCosmonPower(statsWithMalus)

  const result =
    Math.round(
      ((cosmonPowerWithMalus - cosmonPowerWithoutMalus) / cosmonPowerWithoutMalus) * 100 * 100
    ) / 100

  return +result.toFixed(1)
}

export function computeMalusForCosmons(cosmons: CosmonType[]): CosmonTypeWithMalus[] {
  if (cosmons.length === 0) {
    return []
  }

  const lowestCosmon = getLowestCosmon(cosmons)

  return cosmons.map((cosmon) => {
    const cosmonLvl = getCosmonStat(cosmon.stats, 'Level')?.value
    const lowestCosmonLvl = getCosmonStat(lowestCosmon.stats, 'Level')?.value

    // to much diff
    if (cosmonLvl && lowestCosmonLvl && parseInt(cosmonLvl) - parseInt(lowestCosmonLvl) > 3) {
      const statsWithMalus = computeStatsWithMalus(cosmon, lowestCosmon)

      return {
        ...cosmon,
        statsWithMalus: statsWithMalus,
        malusPercent: computeCosmonMalusPercent(cosmon.stats, statsWithMalus),
        cosmonPower: getCosmonPower(cosmon.stats),
        cosmonPowerWithMalus: getCosmonPower(statsWithMalus),
      }
    }

    return {
      ...cosmon,
      statsWithMalus: [...cosmon.stats],
      malusPercent: 0,
      cosmonPower: getCosmonPower(cosmon.stats),
      cosmonPowerWithMalus: getCosmonPower(cosmon.stats),
    }
  })
}

export function fillDeckCosmons(cosmons: CosmonTypeWithMalus[]) {
  let filledArray: (CosmonTypeWithMalus | undefined)[] = [...cosmons]

  for (let i = 0; i < 3; i++) {
    if (filledArray[i] === undefined) {
      filledArray[i] = undefined
    }
  }

  return filledArray
}

export function computeMalusForDeck(
  cosmons: (CosmonType | CosmonTypeWithMalus | undefined)[]
): (CosmonTypeWithMalus | undefined)[] {
  if (cosmons.length === 0) {
    return [undefined, undefined, undefined]
  }

  const filtredCosmons = cosmons.filter((item) => item !== undefined) as (
    | CosmonType
    | CosmonTypeWithMalus
  )[]

  const lowestCosmon = getLowestCosmon(filtredCosmons)

  const cosmonsWithMalus = filtredCosmons.map((cosmon) => {
    const cosmonLvl = getCosmonStat(cosmon.stats, 'Level')?.value
    const lowestCosmonLvl = getCosmonStat(lowestCosmon.stats, 'Level')?.value

    // to much diff
    if (cosmonLvl && lowestCosmonLvl && parseInt(cosmonLvl) - parseInt(lowestCosmonLvl) > 3) {
      const statsWithMalus = computeStatsWithMalus(cosmon, lowestCosmon)

      return {
        ...cosmon,
        statsWithMalus: statsWithMalus,
        malusPercent: computeCosmonMalusPercent(cosmon.stats, statsWithMalus),
        cosmonPower: getCosmonPower(cosmon.stats),
        cosmonPowerWithMalus: getCosmonPower(statsWithMalus),
      }
    }

    return {
      ...cosmon,
      statsWithMalus: [...cosmon.stats],
      malusPercent: 0,
      cosmonPower: getCosmonPower(cosmon.stats),
      cosmonPowerWithMalus: getCosmonPower(cosmon.stats),
    }
  }) as CosmonTypeWithMalus[]

  return fillDeckCosmons(cosmonsWithMalus)
}

export function computeCosmonMalusPercentForDeck(cosmons: CosmonTypeWithMalus[]): number {
  const deckPower = cosmons.reduce((acc, curr) => acc + curr.cosmonPower, 0)
  const deckPowerWithMalus = cosmons.reduce((acc, curr) => acc + curr.cosmonPowerWithMalus, 0)

  const result = Math.round(((deckPowerWithMalus - deckPower) / deckPower) * 100 * 100) / 100

  return +result.toFixed(1)
}

export function getAffinitiesWithoutMalus(affinities: DeckAffinitiesType) {
  return Object.keys(affinities).filter((affinity) => affinity !== AFFINITY_TYPES.MALUS)
}

export function getMalusInAffinities(affinities: DeckAffinitiesType) {
  return Object.keys(affinities).filter((affinity) => affinity === AFFINITY_TYPES.MALUS)
}
