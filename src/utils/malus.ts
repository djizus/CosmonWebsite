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

export function computeAverageMalusPercent(
  stats: CosmonStatType[],
  statsWithMalus: CosmonStatType[]
): number {
  const diffBetweenStatsAndStatsWithMalus: number[] = stats.reduce((acc: number[], stat) => {
    const statWithMalus = getCosmonStat(statsWithMalus, stat.key)

    if (statWithMalus && StatsKeyCanHaveMalus.includes(statWithMalus.key)) {
      const intStat = parseInt(stat.value)
      const intStatWithMalus = parseInt(statWithMalus.value)

      return [...acc, Math.trunc(((intStatWithMalus - intStat) / intStat) * 100)]
    }

    return acc
  }, [])

  return Math.trunc(
    diffBetweenStatsAndStatsWithMalus.reduce((partialSum, value) => partialSum + value, 0) /
      diffBetweenStatsAndStatsWithMalus.length
  )
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
        malusPercent: computeAverageMalusPercent(cosmon.stats, statsWithMalus),
      }
    }

    return {
      ...cosmon,
      statsWithMalus: [...cosmon.stats],
      malusPercent: 0,
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
        malusPercent: computeAverageMalusPercent(cosmon.stats, statsWithMalus),
      }
    }

    return {
      ...cosmon,
      statsWithMalus: [...cosmon.stats],
      malusPercent: 0,
    }
  }) as CosmonTypeWithMalus[]

  return fillDeckCosmons(cosmonsWithMalus)
}

export function computeAverageMalusPercentForDeck(cosmons: CosmonTypeWithMalus[]): number {
  const cosmonsWithMalus = getOnlyCosmonsWithMalus(cosmons)
  const result = cosmonsWithMalus.reduce((acc, curr) => acc + curr.malusPercent, 0)

  return Math.trunc(result / cosmonsWithMalus.length)
}

export function getAffinitiesWithoutMalus(affinities: DeckAffinitiesType) {
  return Object.keys(affinities).filter((affinity) => affinity !== AFFINITY_TYPES.MALUS)
}

export function getMalusInAffinities(affinities: DeckAffinitiesType) {
  return Object.keys(affinities).filter((affinity) => affinity === AFFINITY_TYPES.MALUS)
}
