import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import FlipCard from '@components/FlipCard/FlipCard'
import clsx from 'clsx'
import {
  CosmonStatProgression,
  CosmonXpProgression,
} from '../../FightReportModal/CosmonsProgression'
import * as style from './CardsWithStats.module.scss'
import { getCosmonStat } from '@utils/cosmon'
import { Boost } from 'types/Boost'
import { CosmonTypeWithDecks } from '../BuyBoostModalType'
import { useMemo } from 'react'

interface Props {
  boost: Boost
  cosmon: CosmonTypeWithDecks
  className?: string
  handleClick?: (cosmon: CosmonTypeWithDecks) => void
  variation: 'recap' | 'leaderpicker'
}

const CardsWithStats: React.FC<Props> = ({ boost, cosmon, className, handleClick, variation }) => {
  const statsEvolved = useMemo(() => {
    if (variation === 'leaderpicker') {
      return cosmon.stats!.map((stat) => {
        if (stat.key === boost.boost_name) {
          return {
            ...stat,
            value: Math.ceil(
              parseInt(stat.value) + (boost.inc_value / 100) * parseInt(stat.value)
            ).toString(),
          }
        }

        return stat
      })
    } else {
      return cosmon.stats!
    }
  }, [cosmon, variation, boost])

  const statsToDisplay = useMemo(() => {
    if (variation === 'leaderpicker') {
      return cosmon.stats!
    } else {
      return cosmon.stats!.map((stat) => {
        if (stat.key === boost.boost_name) {
          return {
            ...stat,
            value: Math.floor(
              parseInt(stat.value) - (boost.inc_value / 100) * parseInt(stat.value)
            ).toString(),
          }
        }

        return stat
      })
    }
  }, [cosmon, variation, boost])

  return (
    <div
      onClick={() => handleClick && handleClick(cosmon)}
      className={clsx(style.content, className)}
    >
      <div>
        <FlipCard
          className={style.card}
          card={
            <CosmonCard
              cosmon={cosmon}
              showLevel
              showPersonality
              showNationality
              showScarcity
              imgStyle={{ objectFit: 'cover', borderRadius: 6 }}
            />
          }
          revealed={true}
        />
      </div>
      <div className={style.rightContent}>
        <CosmonXpProgression
          iWin={false}
          levelStat={+getCosmonStat(cosmon.stats!, 'Level')!.value!}
          levelStatEvolved={+getCosmonStat(cosmon.stats!, 'Level')!.value!}
          xpStat={+getCosmonStat(cosmon.stats!, 'Xp')!.value!}
          xpStatEvolved={+getCosmonStat(cosmon.stats!, 'Xp')!.value!}
          xpNextLevel={
            +getCosmonStat(cosmon.stats!, 'Next Level')?.value! ||
            +getCosmonStat(cosmon.stats!, 'Next Level')?.value!
          }
          xpNextLevelEvolved={+getCosmonStat(cosmon.stats!, 'Next Level')?.value! || 0}
          floorXpEvolved={+getCosmonStat(cosmon.stats!, 'Floor Level')?.value! || 0}
          deckName={cosmon.deckName}
        />
        <div className={style.stats}>
          <div className={style.firstColumn}>
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Atq`}
              statKey="Atq"
              stats={cosmon.stats!}
              statsToDisplay={statsToDisplay}
              statsEvolved={statsEvolved}
            />
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Spe`}
              statKey="Spe"
              stats={cosmon.stats!}
              statsToDisplay={statsToDisplay}
              statsEvolved={statsEvolved}
            />
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Luk`}
              statKey="Luk"
              stats={cosmon.stats!}
              statsToDisplay={statsToDisplay}
              statsEvolved={statsEvolved}
            />
          </div>
          <div className={style.secondColumn}>
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Hp`}
              statKey="Hp"
              stats={cosmon.stats!}
              statsToDisplay={statsToDisplay}
              statsEvolved={statsEvolved}
            />
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Def`}
              statKey="Def"
              stats={cosmon.stats!}
              statsToDisplay={statsToDisplay}
              statsEvolved={statsEvolved}
            />
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Int`}
              statKey="Int"
              stats={cosmon.stats!}
              statsToDisplay={statsToDisplay}
              statsEvolved={statsEvolved}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

CardsWithStats.displayName = 'CardsWithStats'

export default CardsWithStats
