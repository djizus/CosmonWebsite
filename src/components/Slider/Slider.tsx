import Button from '@components/Button/Button'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode, useMemo, useState } from 'react'

interface SliderProps {
  children: ReactNode[]
  containerClassName?: string
  showPagination?: boolean
  onEndReached: {
    btnLabel: string
    onClick: () => void
  }
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '-10%' : '10%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '-10%' : '10%',
    opacity: 0,
  }),
}

const Slider: React.FC<SliderProps> = ({
  containerClassName,
  children,
  showPagination = true,
  onEndReached,
}) => {
  const [[page, direction], setPage] = useState([0, 0])
  const [activeBullet, setActiveBullet] = useState(0)

  const nbChildren = useMemo(() => {
    return React.Children.count(children)
  }, [children])

  const paginate = (newDirection: number) => {
    if (page + newDirection < nbChildren && page + newDirection >= 0) {
      setPage([page + newDirection, newDirection])
      setActiveBullet(page + newDirection)
    } else if (page + newDirection === nbChildren) {
      setPage([0, newDirection])
      setActiveBullet(0)
    } else if (page + newDirection === -1) {
      setPage([nbChildren - 1, newDirection])
      setActiveBullet(nbChildren - 1)
    }
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <AnimatePresence initial={false} exitBeforeEnter custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              type: 'spring',
              stiffness: 800,
              damping: 100,
              duration: 0.1,
            },
            opacity: { duration: 0.6 },
          }}
          className={clsx(containerClassName)}
        >
          {children[page]}
        </motion.div>
      </AnimatePresence>
      <div className={clsx('mt-[60px] flex justify-between')}>
        {page > 0 ? (
          <div className="flex flex-1">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                paginate(-1)
              }}
            >
              Previous
            </Button>
          </div>
        ) : (
          <div className="flex flex-1" />
        )}
        {showPagination === true ? (
          <div className="flex flex-1 items-center justify-center gap-[8px]">
            {nbChildren > 1 &&
              Array.from(Array(nbChildren).keys()).map((i) => (
                <div
                  key={i}
                  onClick={() => {
                    setPage([i, 0])
                    setActiveBullet(i)
                  }}
                  style={{
                    width: 8,
                    height: 8,
                    background: activeBullet === i ? '#D9D9D9' : 'rgba(217, 217, 217, 0.3)',
                    borderRadius: '100%',
                  }}
                />
              ))}
          </div>
        ) : null}

        <div className="flex flex-1 justify-end">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              if (page === nbChildren - 1) {
                onEndReached?.onClick()
              } else {
                paginate(1)
              }
            }}
          >
            {page === nbChildren - 1 ? onEndReached.btnLabel : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Slider
