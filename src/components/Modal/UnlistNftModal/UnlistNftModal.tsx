import Button from '@components/Button/Button'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import Modal from '@components/Modal/Modal'
import { SellData } from 'types'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import { convertMicroDenomToDenom } from '@utils/conversion'
import React, { useEffect, useState } from 'react'
import { CosmonType } from 'types'
import * as style from './UnlistNftModal.module.scss'

interface Props {
  cosmon: CosmonType
  handleSubmitUnlistNft: (nftId: string, price: number | undefined) => void
  handleCloseModal: () => void
}

const UnlistNftModal: React.FC<Props> = ({ cosmon, handleSubmitUnlistNft, handleCloseModal }) => {
  const { fetchSellData, unlistNftLoading } = useMarketPlaceStore()
  const [sellData, setSellData] = useState<SellData | undefined>(undefined)

  useEffect(() => {
    fetchSellData(cosmon.id).then((data) => setSellData(data))
  }, [])

  return (
    <Modal subContainerClassname={style.modal} onCloseModal={handleCloseModal} hasCloseButton>
      <p className={style.title}>Cancel listing</p>
      <div className={style.card}>
        <p className={style.cosmonNumber}>Cosmon #{cosmon.id}</p>
        <p className={style.price}>
          Price: {sellData?.price ? convertMicroDenomToDenom(sellData.price) : '???'} XKI
        </p>
        <div className={style.cosmonData}>
          <CosmonCard
            className={style.cosmonCard}
            size="md"
            showLevel
            showScarcity
            showNationality
            showPersonality
            cosmon={cosmon}
          />
        </div>
      </div>
      <Button
        disabled={!sellData}
        isLoading={unlistNftLoading}
        className={style.closeButton}
        onClick={() => handleSubmitUnlistNft(cosmon.id, sellData?.price ?? undefined)}
      >
        Confirm canceling
      </Button>
    </Modal>
  )
}

UnlistNftModal.displayName = 'UnlistNftModal'

export default UnlistNftModal
