import Modal from '@components/Modal/Modal'
import Slider from '@components/Slider/Slider'
import React, { useContext } from 'react'
import { FightContext } from '../FightContext'
import CosmonsProgression from './CosmonsProgression'
import MainEvents from './MainEvents'

interface FightReportModalProps {
  onClickNewFight: () => void
  onCloseModal: () => void
}

const FightReportModal: React.FC<FightReportModalProps> = ({ onClickNewFight, onCloseModal }) => {
  const { battleOverTime } = useContext(FightContext)
  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton={false} width={700}>
      <Slider
        showPagination={false}
        onEndReached={{
          btnLabel: 'Go back to arena',
          onClick: onCloseModal,
        }}
      >
        <MainEvents battle={battleOverTime!} />
        <CosmonsProgression onClickNewFight={onClickNewFight} />
      </Slider>
    </Modal>
  )
}

export default FightReportModal
