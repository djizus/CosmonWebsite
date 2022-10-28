import { chainInfo, ibcTestnetChainInfo } from 'src/config'
import { cosmos, InstallError } from '@cosmostation/extension-client'
import { OfflineSigner } from '@cosmjs/proto-signing'
import { getOfflineSigner } from '@cosmostation/cosmos-client'

const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const PUBLIC_IBC_CHAIN_ID = process.env.NEXT_PUBLIC_IBC_CHAIN_ID

export const connectWithCosmostation = async (): Promise<
  [OfflineSigner | null, OfflineSigner | null]
> => {
  try {
    const provider = await cosmos()
    const supportedChains = await provider.getSupportedChains()

    if (
      ![...supportedChains.official, ...supportedChains.unofficial].includes(
        chainInfo.bech32Config.bech32PrefixAccAddr
      )
    ) {
      await provider.addChain({
        addressPrefix: chainInfo.bech32Config.bech32PrefixAccAddr,
        baseDenom: chainInfo.stakeCurrency.coinMinimalDenom,
        displayDenom: chainInfo.stakeCurrency.coinDenom,
        chainId: chainInfo.chainId,
        chainName: chainInfo.chainName,
        restURL: chainInfo.rest,
        coinGeckoId: chainInfo.stakeCurrency.coinGeckoId,
        coinType: chainInfo.bip44.coinType.toString(),
        decimals: chainInfo.stakeCurrency.coinDecimals,
        imageURL: 'https://wallet.cosmostation.io/images/symbol/kichain.png',
      })
    }
    // for test
    if (
      ![...supportedChains.official, ...supportedChains.unofficial].includes(
        ibcTestnetChainInfo.bech32Config.bech32PrefixAccAddr
      )
    ) {
      await provider.addChain({
        addressPrefix: ibcTestnetChainInfo.bech32Config.bech32PrefixAccAddr,
        baseDenom: ibcTestnetChainInfo.currencies[0].coinMinimalDenom,
        displayDenom: ibcTestnetChainInfo.currencies[0].coinDenom,
        chainId: ibcTestnetChainInfo.chainId,
        chainName: ibcTestnetChainInfo.chainName,
        restURL: ibcTestnetChainInfo.rest,
        coinGeckoId: ibcTestnetChainInfo.currencies[0].coinGeckoId,
        coinType: ibcTestnetChainInfo.bip44.coinType.toString(),
        decimals: ibcTestnetChainInfo.currencies[0].coinDecimals,
        imageURL: 'https://wallet.cosmostation.io/images/symbol/osmosis.png',
      })
    }
    //
    const account = await provider.requestAccount(chainInfo.chainId)
    console.log('🚀 ~ file: cosmostation.ts ~ line 38 ~ connectWithCosmostation ~ account', account)

    return [
      await getOfflineSigner(PUBLIC_CHAIN_ID!),
      /* await getOfflineSigner(PUBLIC_IBC_CHAIN_ID!) */ null,
    ]
  } catch (e) {
    if (e instanceof InstallError) {
      console.log('not installed')
    }
    console.error(e)
  }

  return [null, null]
}
