import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import CosmonHealthBar from '@components/Cosmon/CosmonHealthBar'
import FlipCard from '@components/FlipCard/FlipCard'
import { getCosmonStat } from '@utils/cosmon'
import clsx from 'clsx'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import React, { forwardRef, useMemo, useRef } from 'react'
import { CosmonType, FightEventType } from 'types'
import styles from './Fighter.module.scss'

type FighterProps = {
  cosmon: CosmonType
  isAttacker: boolean
  isDefender: boolean
  isKO: boolean
  isOpponentSide: boolean
  isDodge?: boolean
  critical?: number
  shine: boolean
  revealCards: string[]
  isFightStart: boolean
  currentFightEvent: FightEventType | undefined
  animationsSpeed?: number
  highlightSameAffinity?: boolean
} & HTMLMotionProps<'div'>

const Fighter = forwardRef<HTMLDivElement, FighterProps>(
  (
    {
      cosmon,
      isAttacker,
      isDefender,
      shine,
      revealCards,
      isKO,
      isOpponentSide,
      isDodge,
      critical,
      isFightStart,
      currentFightEvent,
      animationsSpeed = 1,
      highlightSameAffinity = false,
      ...divProps
    },
    ref
  ) => {
    const cosmonHpMax = useRef(getCosmonStat(cosmon.stats!, 'Hp')?.value)
    const cardVariants = {
      default: {
        opacity: 1,
        transform: 'translate(0, 0)',
        zIndex: 1,
      },
      attacking: {
        y: isOpponentSide ? [0, -10, 30, 0] : [0, 10, -30, 0],
        zIndex: 900,
        transition: {
          duration: 0.4 / animationsSpeed,
          type: 'keyframes',
          times: [0, 0.25, 0.5, 75, 1],
          ease: 'linear',
        },
      },
      dodge: {
        x: [0, -15, 15, -15, 15, 0],
        transition: {
          duration: 0.8 / animationsSpeed,
          type: 'keyframes',
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          ease: 'linear',
        },
      },
    }

    const cardAnimation = useMemo(() => {
      if (isAttacker) {
        return 'attacking'
      }
      if (isDefender && isDodge) {
        return ['dodge']
      }
      return 'default'
    }, [isAttacker, isDefender, isDodge])

    return (
      <motion.div
        ref={ref}
        key={cosmon.id}
        {...divProps}
        className={clsx(
          `relative h-full w-full rounded-[4px] border-[0.5px] border-[#ffffff]/[0.2] p-[5px] transition-shadow`,
          { 'border-[#ffffff]/[0.6]': isAttacker },
          { 'border-[#f07273]': isDefender },
          { [styles.fighterHighlighted]: highlightSameAffinity },
          divProps.className
        )}
        variants={cardVariants}
        animate={cardAnimation}
      >
        <AnimatePresence>
          {isDefender && critical ? (
            <motion.div
              key={`${cosmon.id}-critical`}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 2],
                transition: {
                  duration: 1.7 / animationsSpeed,
                },
              }}
              style={{ position: 'absolute', top: 20, left: 20, zIndex: 950 }}
            >
              <h2 style={{ color: '#D8635C' }}>-{critical}</h2>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isAttacker && isDodge ? (
            <motion.div
              key={`${cosmon.id}-dodge`}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 2],
                transition: {
                  duration: 1.7 / animationsSpeed,
                },
              }}
              style={{ position: 'absolute', top: 20, right: 20, zIndex: 950 }}
            >
              <h2 style={{ color: 'white' }}>Miss</h2>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {currentFightEvent &&
          currentFightEvent?.def_id === cosmon.id &&
          currentFightEvent?.miss === false &&
          currentFightEvent?.critical === false ? (
            <motion.div
              key={`${cosmon.id}-dam-${currentFightEvent?.def_id}-${currentFightEvent?.atk_id}}`}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 2],
                transition: {
                  duration: 1 / animationsSpeed,
                },
              }}
              style={{ position: 'absolute', top: 20, right: 20, zIndex: 950 }}
            >
              <h2>-{currentFightEvent.damage}</h2>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {revealCards.includes(cosmon.id) && (
            <motion.div
              key={`${cosmon.id}-Hp`}
              animate={{ opacity: 1, transition: { delay: 1 } }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                width: '100%',
                bottom: 11,
                left: 0,
                zIndex: 952,
                padding: '0 10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CosmonHealthBar
                hp={getCosmonStat(cosmon.stats!, 'Hp')?.value!}
                hpMax={cosmonHpMax.current!}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <FlipCard
          card={
            <CosmonCard
              cosmon={cosmon}
              imgStyle={{ objectFit: 'cover', borderRadius: 4, height: '100%' }}
            />
          }
          imgStyle={{ borderRadius: 4, height: '100%', width: '100%', objectFit: 'cover' }}
          revealed={revealCards.includes(cosmon.id)}
          revealedDuration={0.8 / animationsSpeed}
          shine={shine}
        />
      </motion.div>
    )
  }
)

export default Fighter
