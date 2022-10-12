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
              Did you listen to Prof. Wosmongton advices during the training mode? You should have!
              Your Cosmon leaders are evolving in a different way following their personalities and
              it may give them a different edge when leveling up. Find the fighting characteristics
              that are the most important, and adjust the composition of your deck to make it to the
              top!
            </p>
          </div>,
        ]}
      </Slider>
    </Modal>
  )
}

export default TrainingModeDescriptionModal
