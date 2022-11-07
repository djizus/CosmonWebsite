import Button from '@components/Button/Button'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode, useMemo, useState } from 'react'

interface SliderProps {
  children: ReactNode[]
  containerClassName?: string
  showPagination?: boolean
  showNavigationButtons?: boolean
  onEndReached?: {
    btnLabel: string
    onClick: () => void
  }
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

const Slider: React.FC<SliderProps> = ({
  containerClassName,
  children,
  showPagination = true,
  showNavigationButtons = true,
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
    <div className="flex h-full w-full flex-col overflow-hidden">
      <AnimatePresence initial={false} exitBeforeEnter custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
          className={clsx(containerClassName)}
        >
          {children[page]}
        </motion.div>
      </AnimatePresence>
      <div className={clsx('mt-[20px] flex justify-between lg:mt-[60px]')}>
        {page > 0 && showNavigationButtons ? (
          <div className="flex">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                paginate(-1)
              }}
              containerClassname="mx-0"
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

        {onEndReached && showNavigationButtons ? (
          <div className="flex justify-end">
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
              containerClassname="mx-0"
            >
              {page === nbChildren - 1 ? onEndReached.btnLabel : 'Next'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-1" />
        )}
      </div>
    </div>
  )
}

export default Slider
