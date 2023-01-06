import { useDeckStore } from '@store/deckStore'
import { CosmonStatKeyType, CosmonStatType, CosmonTraitType, CosmonType } from '../../types/Cosmon'
import { SCARCITIES, scarcities, Scarcity } from '../../types'

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

export const characterOptions: { name: string; value: number }[] = [
  { name: CHARACTER_ABU, value: indexByCharacter(CHARACTER_ABU) },
  { name: CHARACTER_ALEXANDER, value: indexByCharacter(CHARACTER_ALEXANDER) },
  { name: CHARACTER_ASHOKA, value: indexByCharacter(CHARACTER_ASHOKA) },
  { name: CHARACTER_ATTILA, value: indexByCharacter(CHARACTER_ATTILA) },
  { name: CHARACTER_CAESAR, value: indexByCharacter(CHARACTER_CAESAR) },
  { name: CHARACTER_CATHERINE, value: indexByCharacter(CHARACTER_CATHERINE) },
  { name: CHARACTER_CHARLEMAGNE, value: indexByCharacter(CHARACTER_CHARLEMAGNE) },
  { name: CHARACTER_CHURCHILL, value: indexByCharacter(CHARACTER_CHURCHILL) },
  { name: CHARACTER_CLEOPATRA, value: indexByCharacter(CHARACTER_CLEOPATRA) },
  { name: CHARACTER_CYRUS, value: indexByCharacter(CHARACTER_CYRUS) },
  { name: CHARACTER_DIDO, value: indexByCharacter(CHARACTER_DIDO) },
  { name: CHARACTER_FERDINAND, value: indexByCharacter(CHARACTER_FERDINAND) },
  { name: CHARACTER_GENERAL, value: indexByCharacter(CHARACTER_GENERAL) },
  { name: CHARACTER_GENGHIS, value: indexByCharacter(CHARACTER_GENGHIS) },
  { name: CHARACTER_GWENGGAETO, value: indexByCharacter(CHARACTER_GWENGGAETO) },
  { name: CHARACTER_KUBLAI, value: indexByCharacter(CHARACTER_KUBLAI) },
  { name: CHARACTER_MANSA, value: indexByCharacter(CHARACTER_MANSA) },
  { name: CHARACTER_NAPOLEON, value: indexByCharacter(CHARACTER_NAPOLEON) },
  { name: CHARACTER_ODA, value: indexByCharacter(CHARACTER_ODA) },
  { name: CHARACTER_QIN, value: indexByCharacter(CHARACTER_QIN) },
  { name: CHARACTER_RAGNAR, value: indexByCharacter(CHARACTER_RAGNAR) },
  { name: CHARACTER_SALADIN, value: indexByCharacter(CHARACTER_SALADIN) },
  { name: CHARACTER_THEODORA, value: indexByCharacter(CHARACTER_THEODORA) },
  { name: CHARACTER_VICTORIA, value: indexByCharacter(CHARACTER_VICTORIA) },
  { name: CHARACTER_WILLIAM, value: indexByCharacter(CHARACTER_WILLIAM) },
]

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
      return -1
  }
}

export function characterByIndex(index: number): string {
  switch (index) {
    case 0:
      return CHARACTER_ABU
    case 1:
      return CHARACTER_ALEXANDER
    case 2:
      return CHARACTER_ASHOKA
    case 3:
      return CHARACTER_ATTILA
    case 4:
      return CHARACTER_CAESAR
    case 5:
      return CHARACTER_CATHERINE
    case 6:
      return CHARACTER_CHARLEMAGNE
    case 7:
      return CHARACTER_CHURCHILL
    case 8:
      return CHARACTER_CLEOPATRA
    case 9:
      return CHARACTER_CYRUS
    case 10:
      return CHARACTER_DIDO
    case 11:
      return CHARACTER_FERDINAND
    case 12:
      return CHARACTER_GENERAL
    case 13:
      return CHARACTER_GENGHIS
    case 14:
      return CHARACTER_GWENGGAETO
    case 15:
      return CHARACTER_KUBLAI
    case 16:
      return CHARACTER_MANSA
    case 17:
      return CHARACTER_NAPOLEON
    case 18:
      return CHARACTER_ODA
    case 19:
      return CHARACTER_QIN
    case 20:
      return CHARACTER_RAGNAR
    case 21:
      return CHARACTER_SALADIN
    case 22:
      return CHARACTER_THEODORA
    case 23:
      return CHARACTER_VICTORIA
    case 24:
      return CHARACTER_WILLIAM
    default:
      throw new Error('invalid cosmon index')
  }
}

export function getYieldPercent(scarcity: Scarcity | null) {
  switch (scarcity) {
    case 'Common':
      return 0

    case 'Uncommon':
      return 15

    case 'Rare':
      return 20

    case 'Epic':
      return 25

    case 'Legendary':
      return 40

    default:
      return 0
  }
}
