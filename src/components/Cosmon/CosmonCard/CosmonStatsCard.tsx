import { getCosmonStat, getScarcityByCosmon } from '@utils/cosmon'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import { CosmonType } from 'types'
import styles from './CosmonStatsCard.module.scss'

interface CosmonStatsCardProps {
  cosmon: CosmonType
}

const CosmonStatsCard: React.FC<CosmonStatsCardProps> = ({ cosmon }) => {
  const currentXpPercent = useMemo(() => {
    const currentXp = getCosmonStat(cosmon.stats!, 'Xp')?.value
    const xpMax = getCosmonStat(cosmon.stats!, 'Next Level')?.value
    return (currentXp! / xpMax!) * 100
  }, [cosmon])

  return (
    <div
      className={clsx(
        styles.cosmonStatsCardContainer,
        styles[getScarcityByCosmon(cosmon)!.toLowerCase()]
      )}
    >
      <div className={clsx(styles.mainContainer)}>
        <p className={styles.title}>Level {getCosmonStat(cosmon.stats!, 'Level')?.value}</p>
        <div className={clsx(styles.xpProgressionContainer)}>
          <div
            className="absolute top-0 left-0 h-full"
            style={{ background: '#D9D9D9', zIndex: 2, width: `${currentXpPercent}%` }}
          />
          <div
            className="absolute top-0 left-0 h-full w-full"
            style={{ background: 'rgba(217, 217, 217, 0.3)', zIndex: 1 }}
          />
        </div>

        <div
          className={clsx(styles.chartContainer)}
          style={{
            ['--def' as any]: getCosmonStat(cosmon.stats!, 'Def')?.value,
            ['--hp' as any]: getCosmonStat(cosmon.stats!, 'Hp')?.value,
            ['--int' as any]: getCosmonStat(cosmon.stats!, 'Int')?.value,
            ['--luk' as any]: getCosmonStat(cosmon.stats!, 'Luk')?.value,
            ['--spe' as any]: getCosmonStat(cosmon.stats!, 'Spe')?.value,
            ['--atq' as any]: getCosmonStat(cosmon.stats!, 'Atq')?.value,
          }}
        >
          <p>DEF</p>
          <p>HP</p>
          <p>INT</p>
          <p>LUK</p>
          <p>SPE</p>
          <p>ATQ</p>
        </div>

        <div className={clsx(styles.statsContainer)}>
          <div>
            <p>ATQ</p>
            <p>{getCosmonStat(cosmon.stats!, 'Atq')?.value}</p>
          </div>
          <div>
            <p>DEF</p>
            <p>{getCosmonStat(cosmon.stats!, 'Def')?.value}</p>
          </div>
          <div>
            <p>SPE</p>
            <p>{getCosmonStat(cosmon.stats!, 'Spe')?.value}</p>
          </div>
          <div>
            <p>HP</p>
            <p>{getCosmonStat(cosmon.stats!, 'Hp')?.value}</p>
          </div>
          <div>
            <p>LUK</p>
            <p>{getCosmonStat(cosmon.stats!, 'Luk')?.value}</p>
          </div>
          <div>
            <p>INT</p>
            <p>{getCosmonStat(cosmon.stats!, 'Int')?.value}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CosmonStatsCard
