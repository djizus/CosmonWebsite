import { AminoSignResponse } from '@cosmjs/launchpad'
import { AccountData, OfflineSigner } from '@cosmjs/proto-signing'
import { connectWallet, CosmostationAccount } from '@cosmostation/cosmos-client'
import { GetAccountError, MobileConnectError, SignError } from '@cosmostation/cosmos-client/error'
import { useWalletStore } from '@store/walletStore'
import { payloadId } from '@walletconnect/utils'

const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

export const getOfflineSignerCosmostation = async (): Promise<OfflineSigner> => {
  try {
    const { disconnect } = useWalletStore.getState()

    const connector = await connectWallet()

    connector.on('disconnect', () => {
      disconnect()
    })

    if (!connector) {
      throw new MobileConnectError()
    }

    const signer: OfflineSigner = {
      getAccounts: async () => {
        try {
          const params = {
            id: payloadId(),
            jsonrpc: '2.0',
            method: 'cosmostation_wc_accounts_v1',
            params: [PUBLIC_CHAIN_ID!],
          }
          const keys = (await connector.sendCustomRequest(params)) as CosmostationAccount[]
          const accounts = keys.map(
            (key) =>
              ({
                address: key.bech32Address,
                algo: 'secp256k1',
                pubkey: key.pubKey,
              } as AccountData)
          )
          return accounts
        } catch (err) {
          throw new GetAccountError()
        }
      },
      signAmino: async (signerAddress, signDoc) => {
        try {
          const signedTx = (await connector.sendCustomRequest({
            id: payloadId(),
            jsonrpc: '2.0',
            method: 'cosmostation_wc_sign_tx_v1',
            params: [PUBLIC_CHAIN_ID!, signerAddress, signDoc],
          })) as AminoSignResponse[]
          return signedTx[0]
        } catch (err) {
          throw new SignError()
        }
      },
    }

    return signer
  } catch (err) {
    throw new Error(`getMobileOfflineSignerWithConnect :: error during :: ${err}`)
  }
}
