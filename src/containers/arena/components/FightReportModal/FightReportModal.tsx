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
    <Modal
      onCloseModal={onCloseModal}
      hasCloseButton={false}
      containerClassname="max-w-[98vw] w-[98vw] lg:max-w-[700px] lg:w-[700px]"
    >
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
