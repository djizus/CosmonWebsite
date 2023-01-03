import Button from '@components/Button/Button'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import Modal from '@components/Modal/Modal'
import { SellDataResponse } from '@services/marketplace'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import { convertMicroDenomToDenom } from '@utils/conversion'
import React, { useEffect, useState } from 'react'
import { CosmonType } from 'types'
import * as style from './ListConfirmNftModal.module.scss'

interface Props {
  cosmon: CosmonType
  handleCloseModal: () => void
}

const ListConfirmNftModal: React.FC<Props> = ({ cosmon, handleCloseModal }) => {
  const { fetchSellData } = useMarketPlaceStore()
  const [sellData, setSellData] = useState<SellDataResponse | undefined>(undefined)

  useEffect(() => {
    fetchSellData(cosmon.id).then((data) => setSellData(data))
  }, [])

  return (
    <Modal subContainerClassname={style.modal} onCloseModal={handleCloseModal} hasCloseButton>
      <p className={style.title}>You have listed your cosmon with success</p>
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
      <p className={style.tipsText}>
        You can now find your NFT in the marketplace section under the label
        <br />
        “My listing”.
      </p>
      <Button className={style.closeButton} onClick={handleCloseModal}>
        Got it
      </Button>
    </Modal>
  )
}

ListConfirmNftModal.displayName = 'ListConfirmNftModal'

export default ListConfirmNftModal
