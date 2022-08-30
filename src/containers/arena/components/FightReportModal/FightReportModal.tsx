import Modal from '@components/Modal/Modal'
import Slider from '@components/Slider/Slider'
import React, { useMemo } from 'react'
import { useMount } from 'react-use'
import { FightType } from 'types'
import CosmonsProgression from './CosmonsProgression'
import MainEvents from './MainEvents'

interface FightReportModalProps {
  battle: FightType
  onCloseModal: () => void
}

const FightReportModal: React.FC<FightReportModalProps> = ({ battle, onCloseModal }) => {
  useMount(() => {
    console.log(battle.events.filter((e) => e.def_health === 0))
  })

  const s = useMemo(() => {}, [battle])

  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton>
      <div></div>
      <Slider
        showPagination={false}
        onEndReached={{
          btnLabel: 'Back to my decks',
          onClick: onCloseModal,
        }}
      >
        <MainEvents battle={battle} />
        <CosmonsProgression battle={battle} />
      </Slider>
    </Modal>
  )
}

export default FightReportModal
