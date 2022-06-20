import { Coin } from '@cosmjs/amino/build/coins'
import { convertMicroDenomToDenom } from './conversion'

export const getShortAddress = (address?: string) => {
  return address?.slice(0, 6) + '...' + address?.slice(address.length - 4)
}

export const getAmountFromDenom = (denom: string, coins: Coin[]) => {
  const amount =
    convertMicroDenomToDenom(
      coins.find((coin) => coin.denom === denom)?.amount || 0
    ) || 0
  return Number(amount.toFixed(3))
}
