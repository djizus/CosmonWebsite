import { truncate } from '@utils/text'
import styles from './LastAction.module.scss'
import { formatDistance } from 'date-fns'
import React, { Ref, useMemo } from 'react'
import { CustomIndexedTxWithDisplayData } from './BandeauLastBlockchainActions'
import LastAction from './LastAction'

interface LastClaimAirdropProps {
  ref?: Ref<HTMLDivElement>
  tx: CustomIndexedTxWithDisplayData
}

const LastClaimAirdrop: React.FC<LastClaimAirdropProps> = ({ ref, tx }) => {
  const title = useMemo(() => {
    const { events } = JSON.parse(tx.rawLog)[0]
    const wasmAttributes = events?.find((e: any) => e.type === 'message')?.attributes
    const claimer = wasmAttributes?.find((att: any) => att.key === 'sender')?.value
    return `${(claimer && truncate(claimer, 6)) || ''} claimed airdrop`
  }, [tx])

  return (
    <LastAction ref={ref} className={styles.claimAirdrop}>
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

export default LastClaimAirdrop
