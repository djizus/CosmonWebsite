import { useWalletStore } from '../../store/walletStore'
import ConnectionPanel from './ConnectionPanel'

type ConnectionNeededContentProps = {
  connectPanelCmp?: React.ReactNode
  children: React.ReactNode
}

const ConnectionNeededContent = ({
  connectPanelCmp,
  children,
}: ConnectionNeededContentProps) => {
  const { connect, isConnected } = useWalletStore((state) => state)

  return (
    <>
      {!isConnected
        ? connectPanelCmp || <ConnectionPanel connect={connect} />
        : children}
    </>
  )
}

export default ConnectionNeededContent
