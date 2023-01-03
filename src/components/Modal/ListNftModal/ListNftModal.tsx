import Button from '@components/Button/Button'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import InputText from '@components/Input/InputText'
import { Coin } from '@cosmjs/proto-signing'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from '@utils/conversion'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import numeral from 'numeral'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CosmonType } from 'types'
import * as style from './ListNftModal.module.scss'

interface Props {
  cosmon: CosmonType
  handleCloseModal: () => void
  handleSubmitListNft: (nftId: string, price: Coin) => void
}

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const ListNftModal: React.FC<Props> = ({ cosmon, handleCloseModal, handleSubmitListNft }) => {
  const { floor, fetchKPI, listNftLoading } = useMarketPlaceStore()

  // We need to fetch KPI every time we display nft list modal
  useEffect(() => {
    fetchKPI()
  }, [])

  const [price, setPrice] = useState<number | null>(null)
  const handleKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        handleCloseModal()
      }
    },
    [handleCloseModal]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSubmit = () => {
    if (price !== null) {
      handleSubmitListNft(cosmon.id, {
        amount: convertDenomToMicroDenom(price),
        denom: 'utki',
      })
    }
  }

  const floorPrice = useMemo(() => {
    return numeral(convertMicroDenomToDenom(floor?.amount!)).format('0,0')
  }, [floor])

  return (
    <motion.div
      onClick={(e) => {
        handleCloseModal()
        e.stopPropagation()
      }}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={style.overlay}
    >
      <div onClick={(e) => e.stopPropagation()} className={clsx(style.modal)}>
        <Button
          withoutContainer
          className={style.closeButton}
          onClick={handleCloseModal}
          type="ghost"
        >
          ╳
        </Button>
        <div className={clsx(style.modalContent)}>
          <p className={style.modalTitle}>List for Sale</p>
          <div className={style.cosmonContainer}>
            <CosmonCard
              className={style.card}
              cosmon={cosmon}
              showLevel
              showPersonality
              showScarcity
              showNationality
              size="sm"
            />
            <div className={style.cosmonData}>
              <p className={style.cosmonNumber}>Cosmon #{cosmon.id}</p>
              <p className={style.floorPrice}>Floor price: {floorPrice} XKI</p>
            </div>
          </div>
          <p className={style.sellingPrice}>Selling price</p>
          <div className={style.priceInputContainer}>
            <InputText
              min={0}
              type="number"
              className={style.priceInput}
              value={price ?? ''}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPrice(parseFloat(e.currentTarget.value))
              }}
            />
            <div className={style.xki}>
              <img width="32px" height="32px" src="../icons/xki.png" alt="" />
              <span className={style.xkiLabel}>XKI</span>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            withoutContainer
            disabled={!price || price < 0}
            className={style.submitButton}
            isLoading={listNftLoading}
          >
            List now
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

ListNftModal.displayName = 'ListNftModal'

export default ListNftModal
