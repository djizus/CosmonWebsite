import { Coin } from '@cosmjs/proto-signing'
import React from 'react'
import * as style from './Header.module.scss'
import clsx from 'clsx'
import { convertMicroDenomToDenom } from '@utils/conversion'

interface Props {
  floor: Coin | null
  totalVolume: Coin | null
  items: number
  collection?: string
  className?: string
}

const Header: React.FC<Props> = ({ floor, totalVolume, items, collection, className }) => {
  return (
    <div className={clsx(style.headerContainer, className)}>
      <img className={style.logo} src={'/logo.png'} />
      <div className={style.collectionInfo}>
        <p className={style.collectionTitle}>Cosmons Leaders</p>
        <p className={style.collectionAddress}>{collection ?? ''}</p>
      </div>
      <div className={style.separatorContainer}>
        <hr className={style.separator} />
      </div>
      <div className={style.info}>
        <p className={style.label}>Items</p>
        <p className={style.value}>{items}</p>
      </div>
      <div className={style.info}>
        <p className={style.label}>Total Volume</p>
        <p className={style.value}>{totalVolume?.amount}</p>
      </div>
      <div className={style.info}>
        <p className={style.label}>Floor Price</p>
        <div className={style.floorPriceValue}>
          <img className={style.floorPriceValueImg} src="/icons/xki.png" alt="" />
          <span className={style.floorPriceValueText}>
            {convertMicroDenomToDenom(floor?.amount ?? '')}
          </span>
        </div>
      </div>
    </div>
  )
}

Header.displayName = 'Header'

export default Header
