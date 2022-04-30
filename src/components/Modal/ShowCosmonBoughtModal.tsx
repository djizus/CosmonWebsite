import { CosmonType } from '../../../types/Cosmon'
import Modal from './Modal'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import Hover from 'react-3d-hover'
import Button from '../Button/Button'
import { useRouter } from 'next/router'
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'

type ShowCosmonBoughtModalProps = {
  cosmon: CosmonType
  onCloseModal: () => void
}

export default function ShowCosmonBoughtModal({
  cosmon,
  onCloseModal,
}: ShowCosmonBoughtModalProps) {
  const { width, height } = useWindowSize()
  const [showConfetti, set_showConfetti] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      set_showConfetti(true)
    }, 1000)
  })

  const router = useRouter()

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
        <Modal onCloseModal={onCloseModal}>
          <div className="flex flex-col items-center justify-center text-white">
            <Transition.Child
              enter="transition-opacity ease-linear duration-[2000ms] "
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <h3 className="mb-5 text-2xl font-semibold">
                New asset bought
                <Transition.Child
                  enter="transition-opacity ease-linear delay-[800ms] duration-[2000ms] "
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                >
                  <div className="mt-8 mb-2 text-lg">
                    {cosmon.data.extension.name}{' '}
                  </div>
                </Transition.Child>
              </h3>
            </Transition.Child>

            <Transition.Child
              enter="transition-opacity ease-linear duration-[3500ms] delay-[1000ms]"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <Hover scale={1.05} perspective={300} speed={10}>
                <img
                  // style={{
                  //   WebkitFilter: 'drop-shadow(2px 3px 0px rgba(100,100,10,1))',
                  // }}
                  className="mb-8"
                  height={280}
                  width={167}
                  src={cosmon.data.extension.image}
                />
              </Hover>
            </Transition.Child>

            <Transition.Child
              enter="transition-opacity ease-linear duration-[1000ms] delay-[2000ms]"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <p
                className="text-sm font-light leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: cosmon.data.extension.description,
                }}
              ></p>
            </Transition.Child>

            <Transition.Child
              enter="transition-opacity ease-linear duration-[1000ms] delay-[2900ms]"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <div className="mt-6 flex gap-x-5">
                <Button size="small" onClick={() => router.push('my-assets')}>
                  My assets
                </Button>
                <Button size="small" type="secondary" onClick={onCloseModal}>
                  Close
                </Button>
              </div>
            </Transition.Child>
          </div>
        </Modal>
      </Transition>
    </>
  )
}
