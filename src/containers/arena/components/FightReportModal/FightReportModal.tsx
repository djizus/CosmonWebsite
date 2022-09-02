import Modal from '@components/Modal/Modal'
import Slider from '@components/Slider/Slider'
import React from 'react'
import { FightType } from 'types'
import CosmonsProgression from './CosmonsProgression'
import MainEvents from './MainEvents'

interface FightReportModalProps {
  battle: FightType
  finalBattle: FightType
  onCloseModal: () => void
}

const FightReportModal: React.FC<FightReportModalProps> = ({
  battle,
  finalBattle,
  onCloseModal,
}) => {
  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton={false} width={700}>
      <Slider
        showPagination={false}
        onEndReached={{
          btnLabel: 'Go back to arena',
          onClick: onCloseModal,
        }}
      >
        <MainEvents battle={finalBattle} />
        <CosmonsProgression />
      </Slider>
    </Modal>
  )
}

export default FightReportModal
