import { useWalletStore } from '@store/walletStore'
import { CONNECTION_TYPE } from 'types/Connection'

export const deconnectAndConnect = () => {
  const { disconnect, connect } = useWalletStore.getState()
  disconnect()
  connect(CONNECTION_TYPE.KEPLR)
}
