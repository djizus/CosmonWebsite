import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Close from '/public/icons/close.svg'

export type ModalProps = {
  children: React.ReactNode
  fullScreen?: boolean
  hasCloseButton?: boolean
  containerClassname?: string
  width?: number | string
  onCloseModal: () => void
}

export default function Modal({
  children,
  fullScreen = false,
  hasCloseButton = true,
  containerClassname,
  width,
  onCloseModal,
}: ModalProps) {
  useEffect(() => {
    if (fullScreen) {
      document.getElementsByTagName('html')[0].className = 'overflow-hidden'
      document.getElementsByTagName('body')[0].className = 'overflow-hidden'
      return function cleanup() {
        document.getElementsByTagName('html')[0].className = ''
        document.getElementsByTagName('body')[0].className = ''
      }
    }
  }, [])

  return (
    <>
      <div
        className={clsx('flex justify-center', {
          'h-screen w-screen': fullScreen,
        })}
      >
        <div
          onClick={onCloseModal}
          className="fixed left-0 top-0 z-40 h-full w-full bg-[rgba(27,27,27,0.5)]"
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
          className={clsx(
            'fixed left-1/2 top-1/2 z-50 flex h-fit font-semibold',
            { [`max-w-[533px]`]: width === undefined && !fullScreen },
            { 'top-0 left-0 h-screen w-screen max-w-[100vw]': fullScreen },
            containerClassname
          )}
          style={{ ...(width !== undefined && { width }) }}
        >
          <div
            className={clsx(
              'border-shiny-gradient h-auto w-full rounded-xl bg-cosmon-main-secondary py-8 px-5',
              { 'h-screen w-screen py-0 px-0': fullScreen }
            )}
          >
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
