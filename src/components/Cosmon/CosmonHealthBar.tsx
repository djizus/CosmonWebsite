import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useMemo } from 'react'
import styles from './CosmonHealthBar.module.scss'

interface CosmonHealthBarProps {
  hp: number
  hpMax: number
}

const NB_HEALTH_PORTIONS = 3

const CosmonHealthBar: React.FC<
  CosmonHealthBarProps &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ hp, hpMax, ...props }) => {
  const nbPortionsByHp = useMemo(() => {
    const l = Array.from(Array(NB_HEALTH_PORTIONS).keys()).map(
      (i) => hp > (hpMax / NB_HEALTH_PORTIONS) * i
    )
    return l.filter((i) => i === true).length
  }, [hp, hpMax])

  const getColorByNbPortions = useMemo(() => {
    switch (nbPortionsByHp) {
      case NB_HEALTH_PORTIONS:
        return '#00C838'
      case 2:
        return '#08E3AF'
      case 1:
        return '#00E0FF'
      default:
        return '#00E0FF'
    }
  }, [nbPortionsByHp])

  return (
    <div {...props} className={clsx('flex w-full items-center', props.className)}>
      <div
        className={clsx('flex items-center justify-center py-[0px] px-[5px]', styles.hpContainer)}
        style={{
          borderColor: getColorByNbPortions,
          color: getColorByNbPortions,
          background: 'rgba(' + getColorByNbPortions + ', 0.1)',
        }}
      >
        {hp}
      </div>
      <div className={clsx('relative flex h-[16px] w-full flex-1', styles.hpPortionsContainer)}>
        <div className="absolute top-0 left-0 flex h-full w-full gap-[4px] overflow-hidden py-[2px] px-[3px]">
          {Array.from(Array(NB_HEALTH_PORTIONS).keys()).map((i) => (
            <div
              key={`hp-range-${i}`}
              className={clsx('h-full transition-all', styles.hpPortionContainer)}
              style={{
                backgroundColor:
                  hp > (hpMax / NB_HEALTH_PORTIONS) * i ? getColorByNbPortions : 'transparent',
                width: 'calc(100% / 3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CosmonHealthBar
