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
import { CosmonStatKeyType } from 'types/Cosmon'
import { Boost, BoostForCosmon } from 'types/Boost'
import { Deck, DeckWithBoosts } from 'types/Deck'

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

export function getDeckWithBoosts(deck: Deck, boostsForCosmons: BoostForCosmon[]): DeckWithBoosts {
  return {
    ...deck,
    cosmons: deck.cosmons.map((cosmon) => {
      const cosmonWithBoost = boostsForCosmons.find((item) => item.id === cosmon.id)?.boosts

      if (cosmonWithBoost) {
        return {
          ...cosmon,
          boosts: cosmonWithBoost as [Boost | null, Boost | null, Boost | null],
        }
      }

      return {
        ...cosmon,
        boosts: [null, null, null] as [null, null, null],
      }
    }),
  }
}
