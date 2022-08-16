import clsx from 'clsx'
import { motion } from 'framer-motion'
import React, { ReactNode, useEffect } from 'react'

interface AlertProps {
  type?: 'danger'
  children: string | ReactNode
  className?: string
  onHide?: () => void
}

const Alert: React.FC<AlertProps> = ({
  type = 'danger',
  children,
  className,
  onHide,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onHide) {
        onHide()
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {children ? (
        <motion.div
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={clsx('rounded-[5px] px-[20px] py-[10px]', className, {
            'bg-cosmon-contextual-danger': type === 'danger',
          })}
        >
          {typeof children === 'string' ? (
            <p className="font-medium text-[#F9EAEA]">{children}</p>
          ) : (
            children
          )}
        </motion.div>
      ) : null}
    </>
  )
}

export default Alert

const dropIn = {
  hidden: {
    y: '20%',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '20%',
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}
