import { MINT_SCAN_BLOCK_URL } from '@utils/constants'
import { truncate } from '@utils/text'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import Tab from '/public/icons/newTab.svg'
import { CosmonType, NftHistory } from 'types'
import * as style from './TransactionHistory.module.scss'
import { convertMicroDenomToDenom } from '@utils/conversion'
import { useMarketPlaceStore } from '@store/marketPlaceStore'

interface Props {
  cosmon: CosmonType
  className?: string
}

const TransactionHistory: React.FC<Props> = ({ cosmon, className }) => {
  const [history, setHistory] = useState<NftHistory[]>([])

  const { fetchCosmonHistory } = useMarketPlaceStore()

  useEffect(() => {
    fetchCosmonHistory(cosmon.id).then((result) => setHistory(result))
  }, [])

  if (history.length === 0) {
    return null
  }

  return (
    <div className={clsx(style.container, className)}>
      <p className={style.title}>Transaction history</p>
      <table className={style.table}>
        <thead>
          <tr>
            <th className={clsx(style.label, style.hashCol)}>Transaction Hash</th>
            <th className={clsx(style.label, style.typeCol)}>Type</th>
            <th className={clsx(style.label, style.fromCol)}>From</th>
            <th className={clsx(style.label, style.toCol)}>To</th>
            <th className={clsx(style.label)}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => {
            return (
              <tr key={`${item.from}-${item.block_height}-${item.timestamp}`} className={style.row}>
                <td className={style.hash}>
                  <a
                    className={style.link}
                    href={`${MINT_SCAN_BLOCK_URL}${item.block_height}`}
                    target="_blank"
                  >
                    {item.block_height}
                    <Tab className={style.tabIcon} />
                  </a>
                </td>
                <td className={style.type}>{item.transaction_type}</td>
                <td className={style.from}>{item.from ? truncate(item.from, 12) : '-'}</td>
                <td className={style.to}>{item.to ? truncate(item.to, 12) : '-'}</td>
                <td className={style.price}>{convertMicroDenomToDenom(item.price)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

TransactionHistory.displayName = 'TransactionHistory'

export default TransactionHistory
