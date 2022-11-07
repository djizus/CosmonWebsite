import React, { useEffect, useRef, useState } from 'react'
import { CosmonType } from 'types/Cosmon'

import styles from './CosmonFightPointsBar.module.scss'
import Zap from '@public/icons/zap.svg'
import clsx from 'clsx'
import { getCosmonStat } from '@utils/cosmon'

interface CosmonFightPointsBarProps {
  cosmon: CosmonType
}

const CosmonFightPointsBar: React.FC<
  CosmonFightPointsBarProps &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ cosmon, ...props }) => {
  const fightPointsContainerRef = useRef<HTMLDivElement>(null)
  const [portionWidth, setPortionWidth] = useState(0)

  useEffect(() => {
    if (fightPointsContainerRef.current) {
      updatePortionWidth()
      window.addEventListener('resize', updatePortionWidth)
    }
    return () => {
      window.removeEventListener('resize', updatePortionWidth)
    }
  }, [fightPointsContainerRef.current])

  const updatePortionWidth = () => {
    if (fightPointsContainerRef?.current) {
      const { width } = fightPointsContainerRef.current.getBoundingClientRect()
      setPortionWidth(width / +getCosmonStat(cosmon.stats!, 'Fp Max')?.value!)
    }
  }

  return (
    <div {...props} className={clsx('flex items-center', props.className)}>
      <div
        className={clsx('flex items-center justify-center py-[6px] px-[3px]', styles.zapContainer)}
      >
        <Zap className={styles.zapSvg} />
      </div>
      <div
        ref={fightPointsContainerRef}
        className={clsx(styles.fightPointsContainer)}
        style={{
          gridTemplateColumns: `repeat(${+getCosmonStat(cosmon.stats!, 'Fp Max')
            ?.value!}, minmax(0, ${portionWidth}px))`,
        }}
      >
        {Array.from(Array(+getCosmonStat(cosmon.stats!, 'Fp Max')?.value!).keys()).map((i) => (
          <div
            key={`${cosmon.id}-fp-${i}`}
            className={clsx(styles.fightPointContainer, {
              [styles.fightPointContainerEmpty]: i >= +getCosmonStat(cosmon.stats!, 'Fp')?.value!,
            })}
          />
        ))}
      </div>
    </div>
  )
}

export default CosmonFightPointsBar
