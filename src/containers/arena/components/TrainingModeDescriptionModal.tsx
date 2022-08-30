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
  console.log('HALO')
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
              Attila, the head of a tribal empire, was ruler of the Huns. During his reign, he was
              one of the most feared enemies of the Western and Eastern Roman Empires. Hungarians
              celebrate him as a founding hero.
            </p>
          </div>,
        ]}
      </Slider>
    </Modal>
  )
}

export default TrainingModeDescriptionModal