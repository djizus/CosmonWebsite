import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Scarcity } from '../../types/Scarcity'
import { useWalletStore } from '../store/walletStore'
import { ReactText, useRef } from 'react'
import { toast } from 'react-toastify'

const PUBLIC_SELL_CONTRACT = process.env.NEXT_PUBLIC_SELL_CONTRACT || ''
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''

export const executeBuyCosmon = async (
  signingClient: SigningCosmWasmClient,
  address: string,
  scarcity: Scarcity
) => {
  const toastInstance = toast.loading(`Buying ${scarcity} cosmon`)
  try {
    const price = await queryCosmonPrice(signingClient, scarcity)
    const response = await signingClient.execute(
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
    toast.update(toastInstance, {
      isLoading: false,
      render: 'Cosmon bought successfully',
      closeOnClick: true,
      type: toast.TYPE.SUCCESS,
      autoClose: 2000,
    })
  } catch (e: any) {
    if (e.toString().includes('rejected')) {
      toast.update(toastInstance, {
        isLoading: false,
        render: 'Request rejected by the user',
        closeOnClick: true,
        type: toast.TYPE.INFO,
        autoClose: 2000,
      })
    }

    console.log('error', e)
  } finally {
    toast.clearWaitingQueue()
  }
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
