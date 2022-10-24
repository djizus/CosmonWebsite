const ELIXIR = 'Elixir'
const MEGAELIXIR = 'Megaelixir'
const POWER = 'Power Plus'
const DEFENSE = 'Defense Plus'
const SPEED = 'Speed Plus'
const MIND = 'Mind Plus'
const LUCK = 'Luck Plus'

import Light from '@public/cosmons/stats/light.svg'
import Shield from '@public/cosmons/stats/shield.svg'
import Sparkles from '@public/cosmons/stats/sparkles.svg'
import Sword from '@public/cosmons/stats/sword.svg'
import Zap from '@public/cosmons/stats/zap.svg'
import Spiral from '@public/cosmons/stats/spiral.svg'

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

export function getStatNameFromBoost(boost: string) {
  switch (boost) {
    case ELIXIR:
      return 'energy'
    case MEGAELIXIR:
      return 'energy'
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
  }
}
