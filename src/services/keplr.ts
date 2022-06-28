import { convertFromMicroDenom } from '../utils/conversion'
import { OfflineSigner } from '@cosmjs/proto-signing/build/signer'
import { GasPrice } from '@cosmjs/stargate/build/fee'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient'

const PUBLIC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''

// extend window with CosmosJS and Keplr properties
interface CosmosKeplrWindow extends Window {
  keplr: any
  getOfflineSigner: Function
}

declare let window: CosmosKeplrWindow

export const connectKeplr = async () => {
  // Keplr extension injects the offline signer that is compatible with cosmJS.
  // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
  // And it also injects the helper function to `window.keplr`.
  // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
  if (!window.getOfflineSigner || !window.keplr) {
    alert('Please install keplr extension')
  } else {
    if (window.keplr.experimentalSuggestChain) {
      const stakingDenom = convertFromMicroDenom(
        process.env.NEXT_PUBLIC_DENOM || 'atom'
      )

      try {
        // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
        // cosmoshub-3 is integrated to Keplr so the code should return without errors.
        // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
        // If the user approves, the chain will be added to the user's Keplr extension.
        // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
        // If the same chain id is already registered, it will resolve and not require the user interactions.
        await window.keplr.experimentalSuggestChain({
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID || 'kichain-2',
          chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Ki',
          rpc:
            process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT ||
            'https://rpc-mainnet.blockchain.ki/',
          rest:
            process.env.NEXT_PUBLIC_CHAIN_REST_ENDPOINT ||
            'https://api-mainnet.blockchain.ki/',
          bip44: {
            coinType: process.env.NEXT_PUBLIC_BIP_COIN_TYPE || 118,
          },
          bech32Config: {
            bech32PrefixAccAddr:
              process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX || 'ki',
            bech32PrefixAccPub:
              process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'pub',
            bech32PrefixValAddr:
              process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'valoper',
            bech32PrefixValPub:
              process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'valoperpub',
            bech32PrefixConsAddr:
              process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'valcons',
            bech32PrefixConsPub:
              process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'valconspub',
          },
          currencies: [
            {
              coinDenom: process.env.NEXT_PUBLIC_DENOM || 'KI',
              coinMinimalDenom: process.env.NEXT_PUBLIC_STAKING_DENOM || 'uxki',
              coinDecimals: 6,
              coinGeckoId: process.env.NEXT_PUBLIC_CHAIN_GECKO_ID || 'ki',
            },
          ],
          feeCurrencies: [
            {
              coinDenom: process.env.NEXT_PUBLIC_DENOM || 'KI',
              coinMinimalDenom: 'uxki',
              coinDecimals: 6,
              coinGeckoId: 'ki',
            },
          ],
          stakeCurrency: {
            coinDenom: process.env.NEXT_PUBLIC_DENOM || 'KI',
            coinMinimalDenom: process.env.NEXT_PUBLIC_STAKING_DENOM || 'uxki',
            coinDecimals: 6,
            coinGeckoId: process.env.NEXT_PUBLIC_CHAIN_GECKO_ID || 'ki',
          },
          coinType: 118,
          gasPriceStep: {
            low: 0.025,
            average: 0.25,
            high: 0.03,
          },
          features: ['cosmwasm', 'ibc-transfer', 'ibc-go', 'wasmd_0.24+'],
        })
      } catch (e) {
        alert('Failed to suggest the chain')
        console.log('error details', e)
      }
    } else {
      alert('Please use the recent version of keplr extension')
    }
  }
}

export const makeClient = async (offlineSigner: OfflineSigner) => {
  return await SigningCosmWasmClient.connectWithSigner(
    PUBLIC_RPC_ENDPOINT,
    offlineSigner,
    {
      prefix: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX,
      gasPrice: GasPrice.fromString(
        `0.025${process.env.NEXT_PUBLIC_STAKING_DENOM}`
      ),
    }
  )
}
