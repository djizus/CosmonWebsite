import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Scarcity } from '../../types/Scarcity'

import { FaucetClient } from '@cosmjs/faucet-client'
import { CosmonType } from '../../types/Cosmon'

const PUBLIC_SELL_CONTRACT = process.env.NEXT_PUBLIC_SELL_CONTRACT || ''
const PUBLIC_NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT || ''
const PUBLIC_WHITELIST_CONTRACT =
  process.env.NEXT_PUBLIC_WHITELIST_CONTRACT || ''
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''

export const executeBuyCosmon = (
  signingClient: SigningCosmWasmClient,
  address: string,
  scarcity: Scarcity
) => {
  return new Promise(async (resolve, reject) => {
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

      const tokenId =
        response.logs[0].events
          .find((event) => event.type === 'wasm')
          ?.attributes?.find((attribute) => attribute?.key === 'token_id')
          ?.value || null

      if (tokenId) {
        const cosmonBought: CosmonType = {
          id: tokenId,
          data: await queryCosmonInfo(signingClient, tokenId),
        }
        return resolve({
          message: 'Bought successfully',
          token: cosmonBought,
        })
      } else {
        reject(handleTransactionError('No token id received from the cosmon'))
      }
    } catch (e: any) {
      reject(handleTransactionError(e))
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
        reject(handleTransactionError(e))
      }
    })
  }

export const executeTransferNft = (
  signingClient: SigningCosmWasmClient,
  address: string,
  recipient: string,
  tokenId: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await signingClient.execute(
        address,
        PUBLIC_NFT_CONTRACT,
        {
          transfer_nft: {
            recipient: recipient,
            token_id: tokenId,
          },
        },
        'auto'
      )
      return resolve('Transfered successfully')
    } catch (e: any) {
      reject(handleTransactionError(e))
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

export const queryGetMaxClaimableToken = async (
  signingClient: SigningCosmWasmClient
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await signingClient.queryContractSmart(
        PUBLIC_SELL_CONTRACT,
        {
          get_max_claimable_token: {},
        }
      )
      return resolve(response)
    } catch (e) {
      console.error(`Error while fetching claimable token number`, e)
      return reject(`Error while fetching claimable token number`)
    }
  })
}

export const queryCosmonInfo = async (
  signingClient: SigningCosmWasmClient,
  cosmonId: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (cosmonId) {
      try {
        const data = await signingClient.queryContractSmart(
          PUBLIC_NFT_CONTRACT,
          {
            nft_info: { token_id: cosmonId },
          }
        )
        return resolve(data)
      } catch (e) {
        console.error(`Error while fetching cosmon ${cosmonId}`, e)
        return reject(`Error while fetching cosmon ${cosmonId}`)
      }
    } else {
      return reject('Cosmon ID is missing')
    }
  })
}

export const queryCosmonAvailableByScarcity = async (
  signingClient: SigningCosmWasmClient,
  scarcity: Scarcity
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (scarcity) {
      const data = await signingClient.queryContractSmart(
        PUBLIC_SELL_CONTRACT,
        {
          get_cosmon_available_by_scarcity: { scarcity: scarcity },
        }
      )
      return resolve(data)
    } else {
      return reject('Scarcity is missing')
    }
  })
}

export const queryCheckAirdropEligibility = async (
  signingClient: SigningCosmWasmClient,
  address: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (address) {
      const data = await signingClient.queryContractSmart(
        PUBLIC_WHITELIST_CONTRACT,
        {
          check_address_eligibility: { address: address },
        }
      )
      console.log('address', address)
      console.log('data', data)
      setTimeout(() => {
        return resolve(data)
      }, 600)
    } else {
      return reject('address is missing')
    }
  })
}

export const queryGetClaimData = async (
  signingClient: SigningCosmWasmClient,
  address: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (address) {
      const data = await signingClient.queryContractSmart(
        PUBLIC_WHITELIST_CONTRACT,
        {
          get_claim_data: { address: address },
        }
      )
      console.log('address', address)
      console.log('data', data)
      return resolve(data)
    } else {
      return reject('address is missing')
    }
  })
}

export const executeClaimAirdrop = async (
  signingClient: SigningCosmWasmClient,
  address: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (address) {
        // const tokenId = '1140'
        const response = await signingClient.execute(
          address,
          PUBLIC_SELL_CONTRACT,
          { claim: {} },
          'auto',
          'memo'
        )

        const tokenId =
          response.logs[0].events
            .find((event) => event.type === 'wasm')
            ?.attributes?.find((attribute) => attribute?.key === 'token_id')
            ?.value || null
        console.log('address', address)
        console.log('tokenId', tokenId)

        if (tokenId) {
          const cosmonAirdropped: CosmonType = {
            id: tokenId,
            data: await queryCosmonInfo(signingClient, tokenId),
          }
          console.log('here', cosmonAirdropped)
          return resolve({
            message: 'Claimed successfully',
            token: cosmonAirdropped,
          })
        } else {
          reject(handleTransactionError('No token id received from the cosmon'))
        }
      }
    } catch (e: any) {
      reject(handleTransactionError(e))
    }
  })
}

export const handleTransactionError = (error: any) => {
  console.log('error', error)
  if (error.toString().includes('rejected')) {
    return {
      title: 'Action canceled',
      message: 'Action has been canceled by the user',
    }
  } else {
    return {
      title: 'Unknown error',
      message: error.toString(),
    }
  }
}
