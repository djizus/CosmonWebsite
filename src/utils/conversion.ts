export function convertMicroDenomToDenom(amount: number | string) {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  amount = amount / 1000000
  return isNaN(amount) ? 0 : amount
}

export function convertDenomToMicroDenom(amount: number | string): string {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  amount = amount * 1000000
  return isNaN(amount) ? '0' : String(amount)
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase()
}

export function convertToFixedDecimals(amount: number | string): string {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  if (amount > 0.01) {
    return amount.toFixed(2)
  } else return String(amount)
}

export const zeroVotingCoin = {
  amount: '0',
  denom: 'ucredits',
}

export const zeroStakingCoin = {
  amount: '0',
  denom: process.env.NEXT_PUBLIC_STAKING_DENOM || 'ujuno',
}

export function convertNumberToNumberWithSuffix(number: number): string {
  const oneDigit = number % 10
  const twoDigit = number % 100

  if (oneDigit === 1 && twoDigit !== 11) {
    return number + 'st'
  }
  if (oneDigit === 2 && twoDigit !== 12) {
    return number + 'nd'
  }
  if (oneDigit === 3 && twoDigit !== 13) {
    return number + 'rd'
  }

  return number + 'th'
}
