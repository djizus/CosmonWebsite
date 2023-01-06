import Button from '@components/Button/Button'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import Modal from '@components/Modal/Modal'
import React from 'react'
import { CosmonType } from 'types'
import * as style from './UnlistConfirmNftModal.module.scss'

interface Props {
  cosmon: CosmonType
  handleCloseModal: () => void
}

const UnlistConfirmNftModal: React.FC<Props> = ({ cosmon, handleCloseModal }) => {
  return (
    <Modal subContainerClassname={style.modal} onCloseModal={handleCloseModal} hasCloseButton>
      <p className={style.title}>You have unlisted your cosmon with success</p>
      <div className={style.card}>
        <p className={style.cosmonNumber}>Cosmon #{cosmon.id}</p>
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
        You can now find your NFT in the my assets section under the label “Available”.
      </p>
      <Button className={style.closeButton} onClick={handleCloseModal}>
        Got it
      </Button>
    </Modal>
  )
}

UnlistConfirmNftModal.displayName = 'UnlistConfirmNftModal'

export default UnlistConfirmNftModal
