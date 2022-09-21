import { truncate } from '@utils/text'
import { formatDistance } from 'date-fns'
import React, { Ref, useMemo } from 'react'
import { CustomIndexedTxWithDisplayData } from './BandeauLastBlockchainActions'
import LastAction from './LastAction'
import styles from './LastAction.module.scss'

interface LastLostProps {
  ref?: Ref<HTMLDivElement>
  tx: CustomIndexedTxWithDisplayData
}

const LastLost: React.FC<LastLostProps> = ({ ref, tx }) => {
  const title = useMemo(() => {
    const { events } = JSON.parse(tx.rawLog)[0]
    const wasmAttributes = events?.find((e: any) => e.type === 'wasm')?.attributes
    const winner = wasmAttributes?.find((att: any) => att.key === 'winner')?.value
    const opponentAddr = wasmAttributes?.find((att: any) => att.key === 'opponent')?.value
    const myAddr = wasmAttributes?.find((att: any) => att.key === 'my_address')?.value
    const loser = winner.includes(myAddr) ? opponentAddr : myAddr
    return `${(loser && truncate(loser, 6)) || ''} lost a fight`
  }, [tx])

  return (
    <LastAction ref={ref} className={styles.lost}>
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

export default LastLost
