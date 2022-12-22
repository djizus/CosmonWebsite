import { truncate } from '@utils/text'
import clsx from 'clsx'
import React from 'react'
import { CosmonMarketPlaceType } from 'types'
import * as style from './TransactionHistory.module.scss'

interface Props {
  cosmon: CosmonMarketPlaceType
  className?: string
}

const TransactionHistory: React.FC<Props> = ({ cosmon, className }) => {
  if (!cosmon.history) {
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
          {cosmon.history.map((item) => {
            return (
              <>
                <tr className={style.row}>
                  <td className={style.hash}>{item.block_height}</td>
                  <td className={style.type}>{item.transaction_type}</td>
                  <td className={style.from}>{item.from ? truncate(item.from, 12) : '-'}</td>
                  <td className={style.to}>{item.to ? truncate(item.to, 12) : '-'}</td>
                  <td className={style.price}>{item.price}</td>
                </tr>
                <tr className={style.row}>
                  <td className={style.hash}>{item.block_height}</td>
                  <td className={style.type}>{item.transaction_type}</td>
                  <td className={style.from}>{item.from ? truncate(item.from, 12) : '-'}</td>
                  <td className={style.to}>{item.to ? truncate(item.to, 12) : '-'}</td>
                  <td className={style.price}>{item.price ? item.price : '-'}</td>
                </tr>
                <tr className={style.row}>
                  <td className={style.hash}>{item.block_height}</td>
                  <td className={style.type}>{item.transaction_type}</td>
                  <td className={style.from}>{item.from ? truncate(item.from, 12) : '-'}</td>
                  <td className={style.to}>{item.to ? truncate(item.to, 12) : '-'}</td>
                  <td className={style.price}>{item.price}</td>
                </tr>
                <tr className={style.row}>
                  <td className={style.hash}>{item.block_height}</td>
                  <td className={style.type}>{item.transaction_type}</td>
                  <td className={style.from}>{item.from ? truncate(item.from, 12) : '-'}</td>
                  <td className={style.to}>{item.to ? truncate(item.to, 12) : '-'}</td>
                  <td className={style.price}>{item.price}</td>
                </tr>
                <tr className={style.row}>
                  <td className={style.hash}>{item.block_height}</td>
                  <td className={style.type}>{item.transaction_type}</td>
                  <td className={style.from}>{item.from ? truncate(item.from, 12) : '-'}</td>
                  <td className={style.to}>{item.to ? truncate(item.to, 12) : '-'}</td>
                  <td className={style.price}>{item.price}</td>
                </tr>
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

TransactionHistory.displayName = 'TransactionHistory'

export default TransactionHistory
