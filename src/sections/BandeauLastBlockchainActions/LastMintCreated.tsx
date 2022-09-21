import { truncate } from '@utils/text'
import { formatDistance } from 'date-fns'
import React, { Ref, useMemo } from 'react'
import { CustomIndexedTxWithDisplayData } from './BandeauLastBlockchainActions'
import LastAction from './LastAction'
import styles from './LastAction.module.scss'

interface LastMintCreatedProps {
  ref?: Ref<HTMLDivElement>
  tx: CustomIndexedTxWithDisplayData
}

const LastMintCreated: React.FC<LastMintCreatedProps> = ({ ref, tx }) => {
  const title = useMemo(() => {
    const { events } = JSON.parse(tx.rawLog)[0]
    const wasmAttributes = events?.find((e: any) => e.type === 'coin_received')?.attributes
    const receiver = wasmAttributes?.find((att: any) => att.key === 'receiver')?.value
    return `${(receiver && truncate(receiver, 6)) || ''} minted a card`
  }, [tx])

  return (
    <LastAction ref={ref} className={styles.mintCreated}>
      <div className="flex gap-[16px]">
        <div>{tx.icon}</div>
        <div className="flex flex-1 flex-col items-start">
          <p>{title}</p>
          <p>{formatDistance(new Date(tx.time), new Date())}</p>
        </div>
      </div>
    </LastAction>
  )
}

export default LastMintCreated
