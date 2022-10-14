import Modal from '@components/Modal/Modal'
import Slider from '@components/Slider/Slider'
import { convertMicroDenomToDenom } from '@utils/conversion'
import React, { useMemo } from 'react'
import { ArenaType } from 'types'

interface ArenaDescriptionModalProps {
  arena: ArenaType
  onCloseModal: () => void
  onSliderEndReached: () => void
}

const ArenaDescriptionModal: React.FC<ArenaDescriptionModalProps> = ({
  arena,
  onCloseModal,
  onSliderEndReached,
}) => {
  const isTrainingMode = useMemo(() => arena?.name == 'Training', [arena])

  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton={false}>
      <Slider
        onEndReached={{
          btnLabel:
            (arena?.price?.amount &&
              `Let's register for ${convertMicroDenomToDenom(arena.price.amount)} $XKI !`) ||
            "Let's register!",
          onClick: onSliderEndReached,
        }}
      >
        {[
          <div
            key={`training-mode-slide-1`}
            className="rounded-[20px] bg-[#282255] py-[32px] px-[25px]"
          >
            <img src="/mad-doctor.png" />
            {isTrainingMode ? (
              <>
                <p className="mt-[20px] text-xl font-semibold text-white">
                  Welcome to Training mode
                </p>
                <p className="mt-[20px] text-sm font-normal text-[#D4D4D4]">
                  Did you listen to Prof. Wosmongton advices during the training mode? You should
                  have! Your Cosmon leaders are evolving in a different way following their
                  personalities and it may give them a different edge when leveling up. Find the
                  fighting characteristics that are the most important, and adjust the composition
                  of your deck to make it to the top!
                </p>
              </>
            ) : (
              <>
                <p className="mt-[20px] text-xl font-semibold text-white">Enter the League</p>
                <p className="mt-[20px] text-sm font-normal text-[#D4D4D4]">
                  Did you listen to Prof. Wosmongton advices during the training mode? You should
                  have! Your Cosmon leaders are evolving in a different way following their
                  personalities and it may give them a different edge when leveling up. Find the
                  fighting characteristics that are the most important, and adjust the composition
                  of your deck to make it to the top in the League!
                </p>
              </>
            )}
          </div>,
        ]}
      </Slider>
    </Modal>
  )
}

ArenaDescriptionModal.displayName = 'ArenaDescriptionModal'

export default ArenaDescriptionModal
