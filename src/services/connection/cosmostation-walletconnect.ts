import { InstallError } from '@cosmostation/extension-client'
import { OfflineSigner } from '@cosmjs/proto-signing'
import { getMobileOfflineSignerWithConnect, getOfflineSigner } from '@cosmostation/cosmos-client'
import WalletConnect from '@walletconnect/client'
import CosmostationWCModal from '@cosmostation/wc-modal'
import { isMobile } from '@walletconnect/browser-utils'
import { useWalletStore } from '@store/walletStore'

const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const PUBLIC_IBC_CHAIN_ID = process.env.NEXT_PUBLIC_IBC_CHAIN_ID

export const connectWithWalletConnectCosmostation = async (): Promise<WalletConnect | null> => {
  try {
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      signingMethods: ['cosmostation_wc_accounts_v1', 'cosmostation_wc_sign_tx_v1'],
      qrcodeModal: new CosmostationWCModal(),
    })

    return new Promise((resolve, reject) => {
      void connector.killSession()
      void connector.createSession()

      connector.on('connect', (error) => {
        if (error) {
          return reject(error)
        }
        return resolve(connector)
      })

      connector.on('disconnect', (error, payload) => {
        const { disconnect } = useWalletStore.getState()
        disconnect()
      })
    })
  } catch (e) {
    if (e instanceof InstallError) {
      console.log('not installed')
    }
    console.error(e)
  }

  return null
}

export const getOfflineSignerCosmostation = async (): Promise<
  [OfflineSigner | null, OfflineSigner | null]
> => {
  try {
    if (isMobile()) {
      return [await getMobileOfflineSignerWithConnect(PUBLIC_CHAIN_ID!), null]
    } else {
      const connector = await connectWithWalletConnectCosmostation()
      console.log('getOfflineSignerCosmostation :: ', connector)

      return [await getOfflineSigner(PUBLIC_CHAIN_ID!), null]
    }
  } catch (err) {
    throw new Error(`getMobileOfflineSignerWithConnect :: error during :: ${err}`)
  }
}
