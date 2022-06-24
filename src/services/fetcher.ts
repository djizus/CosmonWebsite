import { Coin } from '@cosmjs/amino/build/coins'
import { StdFee } from '@cosmjs/amino/build/signdoc'

import { useWalletStore } from '../store/walletStore'
import { makeClient } from './keplr'
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''
const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

type FetcherExecuteType = FetcherType & {
  type: 'execute'
  fee: number | StdFee | 'auto'
  memo?: string | undefined
  funds?: readonly Coin[] | undefined
}

type FetcherQueryType = FetcherType & {
  type: 'query'
  fee?: never
  memo?: never
  funds?: never
}

type FetcherType = {
  contractAddress: string
  payload: Record<string, unknown>
}

// export const fetcher = (...args: any[]) => {
//   console.log('here', args)
//   return {
//     lol: true,
//   }
// }

export const chainFetcher = async ({
  type,
  contractAddress,
  payload,
  fee,
  memo,
  funds,
}: FetcherQueryType | FetcherExecuteType) => {
  const offlineSigner = await (window as any).getOfflineSignerAuto(PUBLIC_CHAIN_ID)
  const signingClient = await makeClient(offlineSigner)
  const [{ address }] = await offlineSigner.getAccounts()
  if (!signingClient) {
    const error = new Error('The signing client object is not initialized')
    throw error
  } else {
    let response
    if (type === 'query') {
      response = signingClient.queryContractSmart(contractAddress, payload)
    } else if (type === 'execute') {
      response = signingClient.execute(
        address,
        contractAddress,
        payload,
        fee || 'auto',
        memo || 'memo',
        funds
      )
    }
    console.log('response', response)
    return response
  }
}
