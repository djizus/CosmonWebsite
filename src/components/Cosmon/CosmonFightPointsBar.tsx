import React from 'react'
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
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> = ({ cosmon, ...props }) => {
  return (
    <div {...props} className={clsx('flex items-center', props.className)}>
      <div
        className={clsx(
          'flex items-center justify-center py-[6px] px-[3px]',
          styles.zapContainer
        )}
      >
        <Zap className={styles.zapSvg} />
      </div>
      <div
        className={clsx(
          'flex h-3/4 w-full flex-1 gap-[1px] py-[2px] px-[3px]',
          styles.fightPointsContainer
        )}
      >
        {Array.from(
          Array(getCosmonStat(cosmon.stats!, 'Fp')?.value).keys()
        ).map((i) => (
          <div className={clsx('h-full w-full', styles.fightPointContainer)} />
        ))}
      </div>
    </div>
  )
}

export default CosmonFightPointsBar
