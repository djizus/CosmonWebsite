import { OfflineSigner } from '@cosmjs/proto-signing/build/signer'
import { GasPrice } from '@cosmjs/stargate/build/fee'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient'
import { SigningStargateClient, StargateClient, StargateClientOptions } from '@cosmjs/stargate'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

const PUBLIC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
const PUBLIC_IBC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_IBC_CHAIN_RPC_ENDPOINT || ''

export const makeClient = async (offlineSigner: OfflineSigner) => {
  if (!offlineSigner) {
    return null
  }
  try {
    return await SigningCosmWasmClient.connectWithSigner(PUBLIC_RPC_ENDPOINT, offlineSigner, {
      prefix: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX,
      gasPrice: GasPrice.fromString(`0.025${process.env.NEXT_PUBLIC_STAKING_DENOM}`),
    })
  } catch (error) {
    return null
  }
}

export const makeUnsignedClient = async () => {
  return await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
}

export const makeStargateClient = async (offlineSigner: OfflineSigner) => {
  if (!offlineSigner) {
    return null
  }
  try {
    return await SigningStargateClient.connectWithSigner(PUBLIC_RPC_ENDPOINT, offlineSigner, {
      prefix: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX,
      gasPrice: GasPrice.fromString(`0.025${process.env.NEXT_PUBLIC_STAKING_DENOM}`),
    })
  } catch (error) {
    return null
  }
}

export const makeStargateClientUnsigned = async (options?: StargateClientOptions) => {
  return await StargateClient.connect(PUBLIC_RPC_ENDPOINT, options)
}

export const makeIbcClient = async (offlineSigner: OfflineSigner) => {
  if (!offlineSigner) {
    return null
  }
  try {
    return await SigningStargateClient.connectWithSigner(PUBLIC_IBC_RPC_ENDPOINT, offlineSigner, {
      prefix: process.env.NEXT_PUBLIC_IBC_CHAIN_BECH32_PREFIX,
      gasPrice: GasPrice.fromString(`0.025${process.env.NEXT_PUBLIC_STAKING_IBC_DENOM}`),
    })
  } catch (error) {
    return null
  }
}
