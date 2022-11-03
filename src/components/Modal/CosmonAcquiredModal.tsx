import { CosmonType } from '../../../types/Cosmon'
import Modal from './Modal'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import Hover from 'react-3d-hover'
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { getScarcityByCosmon, getTrait } from '../../utils/cosmon'
import { isMobile } from '@utils/browser'

type CosmonAcquiredModalProps = {
  cosmon: CosmonType
  actions: React.ReactNode
  onCloseModal: () => void
}

export default function CosmonAcquiredModal({
  cosmon,
  onCloseModal,
  actions,
}: CosmonAcquiredModalProps) {
  const { width, height } = useWindowSize()
  const [showConfetti, set_showConfetti] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      set_showConfetti(true)
    }, 1000)
  })

  return (
    <>
      <Transition appear={true} show>
        {showConfetti && (
          <div className="fixed z-[500]">
            <Confetti
              numberOfPieces={1450}
              tweenDuration={16000}
              recycle={false}
              width={width}
              height={height}
            />
          </div>
        )}
        <Modal
          onCloseModal={onCloseModal}
          {...(isMobile() ? { fullScreen: true } : { width: 600 })}
        >
          <div className="flex flex-col items-center justify-center text-white">
            <Transition.Child
              enter="transition-opacity ease-linear duration-[2000ms] "
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <h3 className="mb-8 text-[22px] font-semibold">New cosmon</h3>
            </Transition.Child>

            <Transition.Child
              className="flex w-full flex-col items-center rounded-[20px] bg-[#282255] pt-8 pb-6"
              enter="transition-opacity ease-linear duration-[3500ms] delay-[1000ms]"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <Hover scale={1.05} perspective={300} speed={10}>
                <img
                  style={{
                    filter: 'drop-shadow(0px 4px 10px rgba(107, 107, 107, 0.7))',
                  }}
                  className="mb-4"
                  height={235}
                  width={140}
                  src={cosmon.data.extension.image}
                />
              </Hover>
              <h4 className="text-[18px] font-semibold leading-[26px]">
                {cosmon.data.extension.name}
              </h4>
              <div className="mt-2 mb-4 rounded-lg bg-cosmon-main-primary px-[10px] py-1">
                {getScarcityByCosmon(cosmon)}
              </div>
              <p
                className="px-10 text-sm font-normal leading-6 "
                dangerouslySetInnerHTML={{
                  // __html: cosmon.data.extension.description,
                  __html: getTrait(cosmon, 'Short Description') || '',
                }}
              ></p>
            </Transition.Child>

            <Transition.Child
              enter="transition-opacity ease-linear duration-[1000ms] delay-[2900ms]"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              {actions}
              {/* {actionType === 'cosmon-bought' ? (
                <CosmonBoughtActions />
              ) : (
                <CosmonClaimedActions onClaimAirdrop={} />
              )} */}
            </Transition.Child>
          </div>
        </Modal>
      </Transition>
    </>
  )
}
