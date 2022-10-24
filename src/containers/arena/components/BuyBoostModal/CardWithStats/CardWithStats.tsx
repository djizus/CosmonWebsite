import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import FlipCard from '@components/FlipCard/FlipCard'
import clsx from 'clsx'
import {
  CosmonStatProgression,
  CosmonXpProgression,
} from '../../FightReportModal/CosmonsProgression'
import * as style from './CardsWithStats.module.scss'
import { getCosmonStat } from '@utils/cosmon'
import { CosmonType } from 'types/Cosmon'
import { Boost } from 'types/Boost'

interface Props {
  boost: Boost
  cosmon: CosmonType
  className?: string
  handleClick?: (cosmon: CosmonType) => void
}

const CardsWithStats: React.FC<Props> = ({ boost, cosmon, className, handleClick }) => {
  return (
    <div
      onClick={() => handleClick && handleClick(cosmon)}
      className={clsx(style.content, className)}
    >
      <div className={style.leftContent}>
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
          // onClick={() => {
          //   set_showCosmonDetail(item)
          // }}
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
          decksName={cosmon.decksName}
        />
        <div className={style.stats}>
          <div className={style.firstColumn}>
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Atq`}
              statKey="Atq"
              stats={cosmon.stats!}
              statsEvolved={cosmon.stats!}
            />
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Spe`}
              statKey="Spe"
              stats={cosmon.stats!}
              statsEvolved={cosmon.stats!}
            />
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Luk`}
              statKey="Luk"
              stats={cosmon.stats!}
              statsEvolved={cosmon.stats!}
            />
          </div>
          <div className={style.secondColumn}>
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Def`}
              statKey="Def"
              stats={cosmon.stats!}
              statsEvolved={cosmon.stats!}
            />
            <CosmonStatProgression
              className={style.stat}
              key={`${cosmon.id}-Int`}
              statKey="Int"
              stats={cosmon.stats!}
              statsEvolved={cosmon.stats!}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

CardsWithStats.displayName = 'CardsWithStats'

export default CardsWithStats
