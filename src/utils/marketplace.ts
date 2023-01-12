import { CosmonMarketPlaceType, MarketPlaceFilters, MarketPlaceFiltersKeys } from 'types'
import {
  getCosmonPersonalityAffinity,
  getCosmonStat,
  getScarcityByCosmon,
  getTrait,
} from './cosmon'

const computeAttributesForCosmonDetails = (cosmon: CosmonMarketPlaceType) => {
  return [
    {
      label: 'Level',
      value: getCosmonStat(cosmon.stats, 'Level')?.value,
    },
    {
      label: 'Type',
      value: getTrait(cosmon, 'Personality'),
    },
    {
      label: 'Type’s preference',
      value: getCosmonPersonalityAffinity(cosmon),
    },
    {
      label: 'Geographical area',
      value: getTrait(cosmon, 'Geographical'),
    },
    {
      label: 'Time Period',
      value: getTrait(cosmon, 'Time'),
    },
    {
      label: 'Scarcity',
      value: getScarcityByCosmon(cosmon),
    },
    {
      label: 'Healt Points',
      value: getCosmonStat(cosmon.stats, 'Hp')?.value,
    },
    {
      label: 'Fight points',
      value: getCosmonStat(cosmon.stats, 'Fp Max')?.value,
    },
    {
      label: 'Intelligence (INT)',
      value: getCosmonStat(cosmon.stats, 'Int')?.value,
    },
    {
      label: 'Attack (ATQ)',
      value: getCosmonStat(cosmon.stats, 'Atq')?.value,
    },
    {
      label: 'Defense (DEF)',
      value: getCosmonStat(cosmon.stats, 'Def')?.value,
    },
    {
      label: 'Chance (LUK) ',
      value: getCosmonStat(cosmon.stats, 'Luk')?.value,
    },
    {
      label: 'Speed (SPE)',
      value: getCosmonStat(cosmon.stats, 'Spe')?.value,
    },
    {
      label: 'Experience points',
      value: getCosmonStat(cosmon.stats, 'Xp')?.value,
    },
  ]
}

export { computeAttributesForCosmonDetails }
