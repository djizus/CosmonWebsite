import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Scarcity } from '../../types/Scarcity'
import { FaucetClient } from '@cosmjs/faucet-client'
import { CosmonType } from '../../types/Cosmon'
import { convertDenomToMicroDenom } from '../utils/conversion'
import { coin, SigningStargateClient } from '@cosmjs/stargate'
import { Coin } from '@cosmjs/amino/build/coins'
import { sleep } from '@cosmjs/utils'
import BigNumber from 'bignumber.js'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/cosmwasmclient'
import { useWalletStore } from '@store/walletStore'
import chunk from 'lodash/chunk'

const Height = require('long')

const PUBLIC_SELL_CONTRACT = process.env.NEXT_PUBLIC_SELL_CONTRACT || ''
const PUBLIC_REWARDS_CONTRACT = process.env.NEXT_PUBLIC_REWARDS_CONTRACT || ''
const PUBLIC_NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT || ''
const PUBLIC_WHITELIST_CONTRACT = process.env.NEXT_PUBLIC_WHITELIST_CONTRACT || ''
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || ''
const PUBLIC_IBC_DENOM = process.env.NEXT_PUBLIC_IBC_DENOM_RAW || ''

export const executeBuyCosmon = (
  signingClient: SigningCosmWasmClient,
  price: string,
  address: string,
  scarcity: Scarcity
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const price = await queryCosmonPrice(signingClient, scarcity)
      const response = await signingClient.execute(
        address,
        PUBLIC_SELL_CONTRACT,
        { buy: { scarcity: scarcity } },
        'auto',
        'memo',
        [
          {
            amount: convertDenomToMicroDenom(price),
            denom: PUBLIC_IBC_DENOM,
          },
        ]
      )

      const tokenId =
        response.logs[0].events
          .find((event) => event.type === 'wasm')
          ?.attributes?.find((attribute) => attribute?.key === 'token_id')?.value || null

      if (tokenId) {
        const cosmonBought: CosmonType = {
          id: tokenId,
          data: await queryCosmonInfo(signingClient, tokenId),
          stats: [],
          statsWithoutBoosts: [],
          boosts: [null, null, null],
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

export const executeMintDeck = (
  signingClient: SigningCosmWasmClient,
  price: string,
  address: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await signingClient.execute(
        address,
        PUBLIC_SELL_CONTRACT,
        { mint_deck: {} },
        'auto',
        'memo',
        [
          {
            amount: convertDenomToMicroDenom(price),
            denom: PUBLIC_IBC_DENOM,
          },
        ]
      )

      console.log(
        'allo',
        response?.logs[0]?.events.find((event) => event?.type === 'wasm')?.attributes
      )

      const tokensId = response.logs[0].events
        .find((event) => event.type === 'wasm')
        ?.attributes?.filter((attribute) => attribute?.key === 'token_id')
        .map((token_id) => token_id.value)

      if (tokensId) {
        const result: CosmonType[] = await Promise.all(
          tokensId.map(async (tokenId) => {
            return {
              id: tokenId,
              data: await queryCosmonInfo(signingClient, tokenId),
              stats: [],
              statsWithoutBoosts: [],
              boosts: [null, null, null],
            }
          })
        )

        return resolve({
          message: 'Bought successfully',
          cosmons: result,
        })
      } else {
        reject(handleTransactionError('No tokens id received from the cosmon'))
      }
    } catch (e: any) {
      reject(handleTransactionError(e))
    }
  })
}

export const executeCreditWalletWithFaucet = (address: string) => async (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const faucetClient = new FaucetClient('https://faucet.cliffnet.cosmwasm.com')
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
  signingClient: SigningCosmWasmClient | CosmWasmClient,
  scarcity: Scarcity
): Promise<string> => {
  const price = await signingClient.queryContractSmart(PUBLIC_SELL_CONTRACT, {
    get_price_by_scarcity: { scarcity: scarcity },
  })
  return price.amount
}

export const queryGetMaxClaimableToken = async (
  signingClient: SigningCosmWasmClient
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await signingClient.queryContractSmart(PUBLIC_SELL_CONTRACT, {
        get_max_claimable_token: {},
      })
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
        const data = await signingClient.queryContractSmart(PUBLIC_NFT_CONTRACT, {
          nft_info: { token_id: cosmonId },
        })

        console.log('allo', data)

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
      const data = await signingClient.queryContractSmart(PUBLIC_SELL_CONTRACT, {
        get_cosmon_available_by_scarcity: { scarcity: scarcity },
      })
      return resolve(data)
    } else {
      return reject('Scarcity is missing')
    }
  })
}

export const queryPreSellOpen = async (signingClient: SigningCosmWasmClient): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await signingClient.queryContractSmart(PUBLIC_SELL_CONTRACT, {
        get_pre_sell_open: {},
      })
      return resolve(data)
    } catch (e) {
      console.error(`Error while fetching info`, e)
      return reject(`Error while fetching info`)
    }
  })
}

export const querySellOpen = async (signingClient: SigningCosmWasmClient): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await signingClient.queryContractSmart(PUBLIC_SELL_CONTRACT, {
        get_sell_open: {},
      })
      return resolve(data)
    } catch (e) {
      console.error(`Error while fetching info`, e)
      return reject(`Error while fetching info`)
    }
  })
}

export const queryCheckAirdropEligibility = async (
  signingClient: SigningCosmWasmClient,
  address: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (address) {
      const data = await signingClient.queryContractSmart(PUBLIC_WHITELIST_CONTRACT, {
        check_address_eligibility: { address: address },
      })

      setTimeout(() => {
        return resolve(data)
      }, 600)
    } else {
      return reject('address is missing')
    }
  })
}

export const queryGetWhitelistInfo = async (
  signingClient: SigningCosmWasmClient,
  address: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (address) {
      const data = await signingClient.queryContractSmart(PUBLIC_SELL_CONTRACT, {
        get_whitelist_info_for_address: { address: address },
      })
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
      const data = await signingClient.queryContractSmart(PUBLIC_WHITELIST_CONTRACT, {
        get_claim_data: { address: address },
      })
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
          '[COSMON] claim airdrop'
        )

        const tokenId =
          response.logs[0].events
            .find((event) => event.type === 'wasm')
            ?.attributes?.find((attribute) => attribute?.key === 'token_id')?.value || null

        if (tokenId) {
          const cosmonAirdropped: CosmonType = {
            id: tokenId,
            data: await queryCosmonInfo(signingClient, tokenId),
            stats: [],
            statsWithoutBoosts: [],
            boosts: [null, null, null],
          }

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

export const initIbc = async (
  kiClient: SigningStargateClient,
  ibcClient: SigningStargateClient,
  kiAddress: string,
  ibcAddress: string,
  deposit: boolean,
  amount: Coin
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const recheckInterval = 500
    const nbRetry = 600_000 / recheckInterval
    let i = 0

    try {
      if (kiAddress) {
        if (deposit) {
          let wantedIbcBalanceOnKi = new BigNumber(
            (
              await kiClient.getBalance(kiAddress, process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '')
            ).amount
          )
          const tx = await ibcClient.sendIbcTokens(
            ibcAddress,
            kiAddress,
            amount,
            'transfer',
            process.env.NEXT_PUBLIC_IBC_TO_KICHAIN_CHANNEL || '',
            undefined,
            Math.floor(Date.now() / 1000) + 60,
            'auto'
          )
          wantedIbcBalanceOnKi = wantedIbcBalanceOnKi.plus(new BigNumber(amount.amount))

          let balance = new BigNumber(0)
          do {
            i++
            await sleep(recheckInterval)
            balance = new BigNumber(
              (
                await kiClient.getBalance(kiAddress, process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '')
              ).amount
            )
          } while (balance.isLessThan(wantedIbcBalanceOnKi) && i < nbRetry)
        } else {
          let wantedIbcBalanceOnKi = new BigNumber(
            (
              await kiClient.getBalance(kiAddress, process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '')
            ).amount
          )
          const tx = await kiClient.sendIbcTokens(
            kiAddress,
            ibcAddress,
            amount,
            'transfer',
            process.env.NEXT_PUBLIC_KICHAIN_TO_IBC_CHANNEL || '',
            undefined,
            Math.floor(Date.now() / 1000) + 60,
            'auto'
          )
          wantedIbcBalanceOnKi = wantedIbcBalanceOnKi.minus(new BigNumber(amount.amount))

          let balance = new BigNumber(0)
          do {
            await sleep(recheckInterval)
            balance = new BigNumber(
              (
                await kiClient.getBalance(kiAddress, process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '')
              ).amount
            )
          } while (balance.isGreaterThan(wantedIbcBalanceOnKi) && i < nbRetry)
        }

        if (i == nbRetry) {
          return reject('Ibc Timeout')
        }

        // Do stuff async and when you have data, return through resolve
        const data = 'success'
        return resolve(data)
      } else {
        return reject('address is missing')
      }
    } catch (e: any) {
      return reject({
        title: 'Ibc Error',
        message: e.toString(),
      })
    }
  })
}

export const claimReward = async (
  signingClient: SigningCosmWasmClient,
  address: string
): Promise<boolean> => {
  await signingClient.execute(
    address,
    PUBLIC_REWARDS_CONTRACT,
    { claim_rewards: {} },
    'auto',
    '[COSMON] claim reward'
  )
  return true
}

export async function fetch_tokens(signingClient: SigningCosmWasmClient, address: string) {
  const tokens: string[] = []
  let start_after = undefined
  while (true) {
    let response = await signingClient.queryContractSmart(
      process.env.NEXT_PUBLIC_NFT_CONTRACT || '',
      {
        tokens: {
          owner: address,
          start_after,
          limit: 10,
        },
      }
    )

    for (const token of response.tokens) {
      tokens.push(token)
    }

    if (response.tokens.length < 10) {
      break
    }

    start_after = tokens[tokens.length - 1]
  }

  return tokens
}

export const getRewards = async (
  signingClient: SigningCosmWasmClient,
  address: string
): Promise<{
  current: Coin
  total: Coin
}> => {
  const { cosmons } = useWalletStore.getState()

  const CHUNK_SIZE = 20

  const chunks = chunk(cosmons, CHUNK_SIZE)

  let tempRewards: { current_reward: Coin; total_rewards: Coin }[] = []

  for (const chunkOfCosmons of chunks) {
    const fetchedRewards = await signingClient.queryContractSmart(PUBLIC_REWARDS_CONTRACT, {
      available_rewards_for_nfts: { nfts: chunkOfCosmons.map((c) => c.id) },
    })
    tempRewards.push(fetchedRewards)
  }

  const rewards = tempRewards.reduce(
    (prev, curr) => {
      return {
        current: {
          amount: (+prev?.current?.amount + +curr.current_reward.amount).toString(),
          denom: curr.current_reward.denom,
        } as Coin,
        total: {
          amount: (+prev?.total?.amount + +curr.total_rewards.amount).toString(),
          denom: curr.total_rewards.denom,
        } as Coin,
      }
    },
    {
      current: coin('0', PUBLIC_STAKING_DENOM),
      total: coin('0', PUBLIC_STAKING_DENOM),
    }
  )
  return rewards
}
