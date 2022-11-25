const ELIXIR = 'Elixir'
const MEGAELIXIR = 'Megaelixir'
const LIFE = 'Life Plus'
const STAMINA = 'Stamina Plus'
const POWER = 'Power Plus'
const DEFENSE = 'Defense Plus'
const SPEED = 'Speed Plus'
const LUCK = 'Luck Plus'
const MIND = 'Mind Plus'

import Heart from '@public/cosmons/stats/heart.svg'
import Shield from '@public/cosmons/stats/shield.svg'
import Sparkles from '@public/cosmons/stats/sparkles.svg'
import Sword from '@public/cosmons/stats/sword.svg'
import Zap from '@public/cosmons/stats/zap.svg'
import Spiral from '@public/cosmons/stats/spiral.svg'
import { CosmonStatKeyType, CosmonStatType, CosmonType } from 'types/Cosmon'
import { Boost } from 'types/Boost'

export function getIconForAttr(boostName: CosmonStatKeyType) {
  switch (boostName) {
    case 'Atq':
      return Sword
    case 'Def':
      return Shield
    case 'Spe':
      return Zap
    case 'Int':
      return Spiral
    case 'Luk':
      return Sparkles
    case 'Hp':
      return Heart
    default:
      return Sword
  }
}

export function getStatAcronymFromBoost(boost: string): CosmonStatKeyType | undefined {
  switch (boost) {
    case POWER:
      return 'Atq'
    case DEFENSE:
      return 'Def'
    case SPEED:
      return 'Spe'
    case MIND:
      return 'Int'
    case LUCK:
      return 'Luk'
    case STAMINA:
      return 'Ap'
    case LIFE:
      return 'Hp'
  }
}

export function getPotionNameFromBoostedStat(boostedStat: CosmonStatKeyType): string | undefined {
  switch (boostedStat) {
    case 'Atq':
      return POWER
    case 'Def':
      return DEFENSE
    case 'Spe':
      return SPEED
    case 'Int':
      return MIND
    case 'Luk':
      return LUCK
    case 'Ap':
      return STAMINA
    case 'Hp':
      return LIFE
  }
}

export function getStatNameFromBoost(boost: string) {
  switch (boost) {
    case ELIXIR:
      return 'energy'
    case MEGAELIXIR:
      return 'energy'
    case LIFE:
      return 'hp'
    case POWER:
      return 'attack'
    case DEFENSE:
      return 'defense'
    case SPEED:
      return 'speed'
    case MIND:
      return 'mind'
    case LUCK:
      return 'luck'
    case STAMINA:
      return 'action points'
  }
}

export function fillBoosts(boosts: (Boost | null)[]): [Boost | null, Boost | null, Boost | null] {
  let filledArray: (Boost | null)[] = [...boosts]

  for (let i = 0; i < 3; i++) {
    if (filledArray[i] === undefined) {
      filledArray[i] = null
    }
  }

  return filledArray as [Boost | null, Boost | null, Boost | null]
}

export function computeStatsWithoutBoosts(stats: CosmonStatType[], boosts: (Boost | null)[]) {
  return stats.reduce<CosmonStatType[]>((acc, stat) => {
    const isStatBoosted = boosts.filter((boost) => boost?.boost_name === stat.key)

    if (isStatBoosted.length > 0) {
      const computedValue = isStatBoosted.reduce<number>((result, curr) => {
        if (curr) {
          return Math.floor(result - (curr.inc_value / 100) * result)
        }

        return result
      }, parseInt(stat.value))

      return [
        ...acc,
        {
          key: stat.key,
          value: Math.round(computedValue).toString(),
        },
      ]
    }

    return [...acc, stat]
  }, [])
}
