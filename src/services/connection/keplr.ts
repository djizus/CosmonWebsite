import { OfflineSigner } from '@cosmjs/proto-signing'
import { chainInfo } from 'src/config'
import { deconnectAndConnect } from './global'

// extend window with CosmosJS and Keplr properties
interface CosmosKeplrWindow extends Window {
  keplr: any
  getOfflineSigner: Function
}

declare let window: CosmosKeplrWindow

export const connectKeplr = async (): Promise<OfflineSigner | null> => {
  if (window.keplr.experimentalSuggestChain) {
    try {
      const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
      // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
      // cosmoshub-3 is integrated to Keplr so the code should return without errors.
      // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
      // If the user approves, the chain will be added to the user's Keplr extension.
      // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
      // If the same chain id is already registered, it will resolve and not require the user interactions.
      await window.keplr.experimentalSuggestChain(chainInfo)

      // set keplr options
      window.keplr.defaultOptions = { sign: { preferNoSetFee: true } }

      // enable website to access keplr
      await (window as any).keplr.enable(PUBLIC_CHAIN_ID)

      // return offlineSigner
      return await (window as any).getOfflineSignerAuto(PUBLIC_CHAIN_ID)
    } catch (e) {
      alert('Failed to suggest the chain')
      console.error('error details', e)
    }
  } else {
    alert('Please use the recent version of keplr extension')
    return null
  }
  return null
}

export const connectIbcClientWithKeplr = async (): Promise<OfflineSigner | null> => {
  if (window.keplr.experimentalSuggestChain) {
    try {
      const PUBLIC_IBC_CHAIN_ID = process.env.NEXT_PUBLIC_IBC_CHAIN_ID
      await (window as any).keplr.enable(PUBLIC_IBC_CHAIN_ID)
      return await (window as any).getOfflineSignerAuto(PUBLIC_IBC_CHAIN_ID)
    } catch (err) {}
  } else {
    return null
  }
  return null
}

export const handleChangeAccount = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keplr_keystorechange', deconnectAndConnect)
  }
}

export const stopListenForChangeAccount = () => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keplr_keystorechange', deconnectAndConnect)
  }
}

export const isKeplrExtensionInstalled = (): boolean => {
  if (typeof window !== 'undefined') {
    // Keplr extension injects the offline signer that is compatible with cosmJS.
    // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
    // And it also injects the helper function to `window.keplr`.
    // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
    return 'keplr' in window
  }
  return false
}
