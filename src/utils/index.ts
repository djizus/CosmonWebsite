import { Coin } from '@cosmjs/amino/build/coins'
import { convertMicroDenomToDenom } from './conversion'

export const getShortAddress = (address?: string) => {
  return address?.slice(0, 6) + '...' + address?.slice(address.length - 4)
}

export const getAmountFromDenom = (denom: string, coins: Coin[]) => {
  const amount =
    convertMicroDenomToDenom(
      coins.find((coin) => coin.denom === process.env.NEXT_PUBLIC_STAKING_DENOM)
        ?.amount || 0
    ) || 0
  return amount.toFixed(3)
}
