import { InstallError } from '@cosmostation/extension-client'
import { OfflineSigner } from '@cosmjs/proto-signing'
import { getMobileOfflineSignerWithConnect } from '@cosmostation/cosmos-client'
import WalletConnect from '@walletconnect/client'
import CosmostationWCModal from '@cosmostation/wc-modal'

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
    })
  } catch (e) {
    if (e instanceof InstallError) {
      console.log('not installed')
    }
    console.error(e)
  }

  return null
}

export const getMobileOfflineSignerWithConnectWallet = async (): Promise<
  [OfflineSigner | null, OfflineSigner | null]
> => {
  /* const connector = await connectWithWalletConnectCosmostation()
  console.log('getMobileOfflineSignerWithConnectWallet ::', connector)
  if (!connector) {
    throw new Error('getMobileOfflineSignerWithConnect :: no connector')
  } */

  try {
    return [
      await getMobileOfflineSignerWithConnect(PUBLIC_CHAIN_ID!),
      await getMobileOfflineSignerWithConnect(PUBLIC_IBC_CHAIN_ID!),
    ]
  } catch (err) {
    throw new Error(`getMobileOfflineSignerWithConnect :: error during :: ${err}`)
  }
}
