import Modal from '@components/Modal/Modal'
import Slider from '@components/Slider/Slider'
import React from 'react'

interface TrainingModeDescriptionModalProps {
  onCloseModal: () => void
  onSliderEndReached: () => void
}

const TrainingModeDescriptionModal: React.FC<TrainingModeDescriptionModalProps> = ({
  onCloseModal,
  onSliderEndReached,
}) => {
  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton={false}>
      <Slider
        onEndReached={{
          btnLabel: "Let's register!",
          onClick: onSliderEndReached,
        }}
      >
        {[
          <div
            key={`training-mode-slide-1`}
            className="rounded-[20px] bg-[#282255] py-[32px] px-[25px]"
          >
            <img src="/mad-doctor.png" />
            <p className="mt-[20px] text-xl font-semibold text-white">Welcome to Training mode</p>
            <p className="mt-[20px] text-sm font-normal text-[#D4D4D4]">
              Prof. Wosmongton is here to teach you how to fight! Build your deck to optimize the
              affinities between your Cosmons. Pay attention to the order of the Cosmons in your
              deck, and have a close look to the fight report to understand what’s going on during
              the fight. It may help you to become a competitive contender!
            </p>
          </div>,
        ]}
      </Slider>
    </Modal>
  )
}

export default TrainingModeDescriptionModal
