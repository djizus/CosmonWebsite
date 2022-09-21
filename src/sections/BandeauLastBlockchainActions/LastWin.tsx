import { truncate } from '@utils/text'
import { formatDistance } from 'date-fns'
import React, { Ref, useMemo } from 'react'
import { CustomIndexedTxWithDisplayData } from './BandeauLastBlockchainActions'
import LastAction from './LastAction'
import styles from './LastAction.module.scss'

interface LastWinProps {
  ref?: Ref<HTMLDivElement>
  tx: CustomIndexedTxWithDisplayData
}

const LastWin: React.FC<LastWinProps> = ({ ref, tx }) => {
  const title = useMemo(() => {
    const { events } = JSON.parse(tx.rawLog)[0]
    const wasmAttributes = events?.find((e: any) => e.type === 'wasm')?.attributes
    const winner = wasmAttributes?.find((att: any) => att.key === 'winner')?.value
    return `${(winner && truncate(winner.split('/')[0], 6)) || ''} won a fight`
  }, [tx])

  return (
    <LastAction ref={ref} className={styles.win}>
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

export default LastWin
