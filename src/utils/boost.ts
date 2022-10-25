const ELIXIR = 'Elixir'
const MEGAELIXIR = 'Megaelixir'
const LIFE = 'Life Potion'
const STAMINA = 'Stamina Potion'
const POWER = 'Power Potion'
const DEFENSE = 'Defense Potion'
const SPEED = 'Speed Potion'
const LUCK = 'Luck Potion'
const MIND = 'Mind Potion'

import Light from '@public/cosmons/stats/light.svg'
import Shield from '@public/cosmons/stats/shield.svg'
import Sparkles from '@public/cosmons/stats/sparkles.svg'
import Sword from '@public/cosmons/stats/sword.svg'
import Zap from '@public/cosmons/stats/zap.svg'
import Spiral from '@public/cosmons/stats/spiral.svg'
import { CosmonStatKeyType } from 'types/Cosmon'

export function getIconForAttr(boost: string) {
  switch (boost) {
    case ELIXIR:
      return Light
    case MEGAELIXIR:
      return Sword
    case POWER:
      return Sword
    case DEFENSE:
      return Shield
    case SPEED:
      return Zap
    case MIND:
      return Spiral
    case LUCK:
      return Sparkles
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
