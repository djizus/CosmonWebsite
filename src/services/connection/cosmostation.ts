import { chainInfo, ibcTestnetChainInfo } from 'src/config'
import { cosmos, InstallError } from '@cosmostation/extension-client'
import { OfflineSigner } from '@cosmjs/proto-signing'
import { getOfflineSigner } from '@cosmostation/cosmos-client'
import { useWalletStore } from '@store/walletStore'
import { CONNECTION_TYPE, CosmosConnectionProvider } from 'types/Connection'

export const connectWithCosmostation = async (): Promise<
  [OfflineSigner | null, CosmosConnectionProvider | null]
> => {
  try {
    const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
    const provider = await cosmos()
    // Add needed chains if not present in cosmostation
    await addChainIfNeeded(provider)
    // Request authorization (display cosmostation popin)
    await provider.requestAccount(PUBLIC_CHAIN_ID!)
    return [await getOfflineSigner(PUBLIC_CHAIN_ID!), provider]
  } catch (e) {
    console.error(e)
  }

  return [null, null]
}

export const connectIbcClientWithCosmostation = async (): Promise<OfflineSigner | null> => {
  try {
    const PUBLIC_IBC_CHAIN_ID = process.env.NEXT_PUBLIC_IBC_CHAIN_ID
    const provider = await cosmos()
    // Add needed chains if not present in cosmostation
    await addChainIfNeeded(provider)
    // Request authorization (display cosmostation popin)
    await provider.requestAccount(PUBLIC_IBC_CHAIN_ID!)
    return await getOfflineSigner(PUBLIC_IBC_CHAIN_ID!)
  } catch (e) {
    console.error(e)
  }

  return null
}

export const handleChangeAccount = (provider: CosmosConnectionProvider) => {
  if (typeof window !== 'undefined' && provider) {
    return provider.onAccountChanged(() => {
      const { connect, disconnect } = useWalletStore.getState()
      disconnect()
      connect(CONNECTION_TYPE.COSMOSTATION)
    })
  }
}

export const stopListenForChangeAccount = (provider: CosmosConnectionProvider, event: any) => {
  if (typeof window !== 'undefined' && provider && event) {
    provider.offAccountChanged(event)
  }
}

const addChainIfNeeded = async (provider: CosmosConnectionProvider) => {
  const supportedChains = await provider.getSupportedChains()
  if (
    ![...supportedChains.official, ...supportedChains.unofficial].includes(
      chainInfo.chainName.toLowerCase()
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
  // we add osmosis-test IBC for preprod only
  if (
    process.env.NEXT_PUBLIC_IS_PRODUCTION === 'false' &&
    ![...supportedChains.official, ...supportedChains.unofficial].includes(
      ibcTestnetChainInfo.chainName.toLowerCase()
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
}

export const isCosmostationExtensionInstalled = async () => {
  try {
    await cosmos()
    return true
  } catch (e) {
    if (e instanceof InstallError) {
      return false
    }
  }
  return false
}
