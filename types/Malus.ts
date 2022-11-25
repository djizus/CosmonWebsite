import { CosmonStatType, CosmonType } from './Cosmon'

export type CosmonTypeWithMalus = CosmonType & {
  malusPercent: number
  statsWithMalus: CosmonStatType[]
}
