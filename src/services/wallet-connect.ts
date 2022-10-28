import Axios from 'axios'
import { BroadcastMode, StdTx } from '@cosmjs/launchpad'
import { chainInfo } from 'src/config'
import { Buffer } from 'buffer'
import WalletConnect from '@walletconnect/client'
// import {} from '@walletconnect/types'
import QRCodeModal from '@walletconnect/qrcode-modal'

export async function sendTxWC(
  chainId: string,
  tx: StdTx | Uint8Array,
  mode: BroadcastMode
): Promise<Uint8Array> {
  const restInstance = Axios.create({
    baseURL: chainInfo.rest,
  })

  const isProtoTx = Buffer.isBuffer(tx) || tx instanceof Uint8Array

  const params = isProtoTx
    ? {
        tx_bytes: Buffer.from(tx as any).toString('base64'),
        mode: (() => {
          switch (mode) {
            case 'async':
              return 'BROADCAST_MODE_ASYNC'
            case 'block':
              return 'BROADCAST_MODE_BLOCK'
            case 'sync':
              return 'BROADCAST_MODE_SYNC'
            default:
              return 'BROADCAST_MODE_UNSPECIFIED'
          }
        })(),
      }
    : {
        tx,
        mode: mode,
      }

  const result = await restInstance.post(isProtoTx ? '/cosmos/tx/v1beta1/txs' : '/txs', params)

  const txResponse = isProtoTx ? result.data['tx_response'] : result.data

  if (txResponse.code != null && txResponse.code !== 0) {
    throw new Error(txResponse['raw_log'])
  }

  return Buffer.from(txResponse.txhash, 'hex')
}

export const createWalletConnect = (): WalletConnect => {
  //   const wcLogoURI = require('../../public/osmosis-logo-wc.png')?.default?.src

  const wc = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org', // Required
    signingMethods: ['keplr_enable_wallet_connect_v1', 'keplr_sign_amino_wallet_connect_v1'],
    qrcodeModal: QRCodeModal,
  })

  // XXX: I don't know why they designed that the client meta options in the constructor should be always ingored...
  // @ts-ignore
  wc._clientMeta = {
    name: 'Cosmon',
    description:
      "Cosmon is the first play to earn in the COSMOS ecosystem combining video games, NFT and financial gain. Now, let's go to war!",
    url: 'https://cosmon.ki',
    icons: [],
    /* icons: wcLogoURI
      ? [
          // Keplr mobile app can't show svg image.
          window.location.origin + wcLogoURI,
        ]
      : [], */
  }

  return wc
}
