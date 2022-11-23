import { CosmonStatType, CosmonType } from 'types'
import { getCosmonStat } from '@utils/cosmon'
import { CosmonTypeWithMalus } from 'types/Malus'

export const StatsKeyCanHaveMalus: string[] = ['Atq', 'Def', 'Spe', 'Psy', 'Luk', 'Int']

export function getLowestCosmon(cosmons: CosmonType[]): CosmonType {
  return cosmons.reduce((acc: CosmonType, curr: CosmonType) => {
    if (acc) {
      const accLvl = getCosmonStat(acc.stats, 'Level')
      const currLvl = getCosmonStat(curr.stats, 'Level')

      if (accLvl && currLvl) {
        return accLvl > currLvl ? curr : acc
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
        value: (parseInt(stat.value) -
          (parseInt(stat.value) - parseInt(lowestCosmonStat.value)) * 0,
        80).toString(),
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

      return [...acc, ((intStat - intStatWithMalus) / ((intStat + intStatWithMalus) / 2)) * 100]
    }

    return acc
  }, [])

  return (
    diffBetweenStatsAndStatsWithMalus.reduce((partialSum, value) => partialSum + value, 0) /
    diffBetweenStatsAndStatsWithMalus.length
  )
}

export function computeMalusForCosmons(cosmons: CosmonType[]): CosmonTypeWithMalus[] {
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
