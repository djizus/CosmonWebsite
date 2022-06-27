import { motion } from 'framer-motion'
import Close from '/public/icons/close.svg'

type ModalProps = {
  onCloseModal: () => void
  children: React.ReactNode
  hasCloseButton?: boolean
}

export default function Modal({
  onCloseModal,
  children,
  hasCloseButton = true,
}: ModalProps) {
  return (
    <>
      <div className="flex justify-center">
        <div
          onClick={onCloseModal}
          className="fixed left-0 top-0 z-40 h-full w-full  bg-[rgba(27,27,27,0.5)]"
        ></div>
        <motion.div
          initial={{
            y: '-40%',
            x: '-50%',
            opacity: 0,
          }}
          animate={{
            y: '-50%',
            opacity: 1,
          }}
          className="fixed left-1/2 top-1/2 z-50 flex h-fit max-w-[533px] font-semibold"
        >
          <div className="border-shiny-gradient h-auto rounded-xl bg-cosmon-main-secondary py-8 px-5">
            {hasCloseButton && (
              <div
                onClick={onCloseModal}
                className="absolute right-8 top-8 cursor-pointer rounded-full bg-cosmon-main-primary p-1"
              >
                <Close className="h-[24px] w-[24px]" />
              </div>
            )}
            {children}
          </div>
        </motion.div>
      </div>
    </>
  )
}
