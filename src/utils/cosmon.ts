import { useDeckStore } from '@store/deckStore'
import { CosmonStatKeyType, CosmonStatType, CosmonTraitType, CosmonType } from '../../types/Cosmon'
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
  return cosmon.data.extension.attributes.find((attr) => attr.trait_type === traitType)?.value
}

export function getScarcitiesNumberByCosmons(cosmons: CosmonType[]): {
  key: Scarcity
  count: number
}[] {
  const arrayOfScarcities = cosmons.map((c) => getScarcityByCosmon(c))

  const cosmonScarcityCounter = Array.from(
    arrayOfScarcities.reduce((r, c) => r.set(c, (r.get(c) || 0) + 1), new Map()),
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

const CHARACTER_ABU = 'Abu Baqr Aas-Siddik'
const CHARACTER_ALEXANDER = 'Alexander The Great'
const CHARACTER_ASHOKA = 'Ashoka the Great'
const CHARACTER_ATTILA = 'Attila the Hun'
const CHARACTER_CAESAR = 'Julius Caesar'
const CHARACTER_CATHERINE = 'Catherine the Great'
const CHARACTER_CHARLEMAGNE = 'Charlemagne'
const CHARACTER_CHURCHILL = 'Winston Churchill'
const CHARACTER_CLEOPATRA = 'Cleopatra VII'
const CHARACTER_CYRUS = 'Cyrus The Great'
const CHARACTER_DIDO = 'Queen Dido'
const CHARACTER_FERDINAND = 'Ferdinand II of Aragón'
const CHARACTER_GENERAL = 'Charles de Gaulle'
const CHARACTER_GENGHIS = 'Genghis Khan'
const CHARACTER_GWENGGAETO = 'Gwanggaeto The Great Conqueror'
const CHARACTER_KUBLAI = 'Kublai Khan'
const CHARACTER_MANSA = 'Mansa Musa'
const CHARACTER_NAPOLEON = 'Napoleon Bonaparte'
const CHARACTER_ODA = 'Oda Nobunaga'
const CHARACTER_QIN = 'Qin Shi Huangdi'
const CHARACTER_RAGNAR = 'Ragnar Lodbrok'
const CHARACTER_SALADIN = 'Saladin'
const CHARACTER_THEODORA = 'Theodora Empress of Byzantium'
const CHARACTER_VICTORIA = 'Queen Victoria'
const CHARACTER_WILLIAM = 'William the Conqueror'

export function indexByCharacter(character: string): number {
  switch (character) {
    case CHARACTER_ABU:
      return 0
    case CHARACTER_ALEXANDER:
      return 1
    case CHARACTER_ASHOKA:
      return 2
    case CHARACTER_ATTILA:
      return 3
    case CHARACTER_CAESAR:
      return 4
    case CHARACTER_CATHERINE:
      return 5
    case CHARACTER_CHARLEMAGNE:
      return 6
    case CHARACTER_CHURCHILL:
      return 7
    case CHARACTER_CLEOPATRA:
      return 8
    case CHARACTER_CYRUS:
      return 9
    case CHARACTER_DIDO:
      return 10
    case CHARACTER_FERDINAND:
      return 11
    case CHARACTER_GENERAL:
      return 12
    case CHARACTER_GENGHIS:
      return 13
    case CHARACTER_GWENGGAETO:
      return 14
    case CHARACTER_KUBLAI:
      return 15
    case CHARACTER_MANSA:
      return 16
    case CHARACTER_NAPOLEON:
      return 17
    case CHARACTER_ODA:
      return 18
    case CHARACTER_QIN:
      return 19
    case CHARACTER_RAGNAR:
      return 20
    case CHARACTER_SALADIN:
      return 21
    case CHARACTER_THEODORA:
      return 22
    case CHARACTER_VICTORIA:
      return 23
    case CHARACTER_WILLIAM:
      return 24
    default:
      throw new Error('invalid cosmon character')
  }
}
