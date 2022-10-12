import { Coin } from '@cosmjs/proto-signing'
import { convertMicroDenomToDenom } from '@utils/conversion'
import clsx from 'clsx'
import numeral from 'numeral'
import React from 'react'
import styles from './CashPrize.module.scss'

interface CashPrizeProps {
  prize: Coin
}

const CashPrize: React.FC<CashPrizeProps> = ({ prize }) => {
  return (
    <div className={clsx(styles.cashPrizeContainer)}>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-[25px]">
          <img src="/xki-logo.png" alt="" />
          <h3>{numeral(convertMicroDenomToDenom(prize.amount)).format('0,0')}</h3>
        </div>
        <p className="mt-[18px] text-sm">
          The prize pool will be distributed among the 5 best players every week
        </p>
      </div>
    </div>
  )
}

export default CashPrize
