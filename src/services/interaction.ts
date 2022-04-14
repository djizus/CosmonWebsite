import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Scarcity } from '../../types/Scarcity'
import { useWalletStore } from '../store/walletStore'
import { ReactText, useRef } from 'react'
import { toast } from 'react-toastify'
import { FaucetClient } from '@cosmjs/faucet-client'

const PUBLIC_SELL_CONTRACT = process.env.NEXT_PUBLIC_SELL_CONTRACT || ''
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''

export const executeBuyCosmon =
  (signingClient: SigningCosmWasmClient, address: string, scarcity: Scarcity) =>
  async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const price = await queryCosmonPrice(signingClient, scarcity)
        await signingClient.execute(
          address,
          PUBLIC_SELL_CONTRACT,
          { buy: { scarcity: scarcity } },
          'auto',
          'memo',
          [
            {
              amount: price,
              denom: PUBLIC_STAKING_DENOM,
            },
          ]
        )
        return resolve('Bought successfully')
      } catch (e: any) {
        console.log('error', e)
        if (e.toString().includes('rejected')) {
          reject('Request has been canceled')
        } else {
          reject(e.toString())
        }
      }
    })
  }

export const executeCreditWalletWithFaucet =
  (address: string) => async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const faucetClient = new FaucetClient(
          'https://faucet.cliffnet.cosmwasm.com'
        )
        await faucetClient.credit(address, PUBLIC_STAKING_DENOM)
        return resolve('Credited successfully')
      } catch (e: any) {
        console.log('error', e)
        reject(e.toString())
      }
    })
  }

export const queryCosmonPrice = async (
  signingClient: SigningCosmWasmClient,
  scarcity: Scarcity
): Promise<string> => {
  // Print divinity_price
  const price = await signingClient.queryContractSmart(PUBLIC_SELL_CONTRACT, {
    get_price_by_scarcity: { scarcity: scarcity },
  })
  console.log(`price of ${scarcity}`, price)
  return price.amount
}
