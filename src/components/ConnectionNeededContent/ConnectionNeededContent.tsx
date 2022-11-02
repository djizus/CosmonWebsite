import { useWalletStore } from '../../store/walletStore'
import ConnectionPanel from './ConnectionPanel'

type ConnectionNeededContentProps = {
  connectPanelCmp?: React.ReactNode
  children: React.ReactNode
}

const ConnectionNeededContent = ({ connectPanelCmp, children }: ConnectionNeededContentProps) => {
  const { isConnected } = useWalletStore()

  return <>{!isConnected ? connectPanelCmp || <ConnectionPanel /> : children}</>
}

export default ConnectionNeededContent
