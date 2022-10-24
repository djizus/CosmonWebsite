import Button from '@components/Button/Button'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import Tooltip from '@components/Tooltip/Tooltip'
import { useWalletStore } from '@store/walletStore'
import { getCosmonStat } from '@utils/cosmon'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode, useContext, useMemo, useState } from 'react'
import { useMount } from 'react-use'
import { CosmonStatKeyType, CosmonStatType, CosmonType } from 'types'
import { FightContext } from '../FightContext'

interface CosmonsProgressionProps {
  onClickNewFight: () => void
}

const CosmonsProgression: React.FC<CosmonsProgressionProps> = ({ onClickNewFight }) => {
  const { cosmons } = useWalletStore()
  const { battleOverTime } = useContext(FightContext)

  const cosmonsEvolved = useMemo(() => {
    return battleOverTime?.me.cosmonsWithoutBonus
      .map((c) => {
        const pos = cosmons.findIndex((cosmon) => cosmon.id === c.id)
        if (pos !== -1) {
          return cosmons[pos]
        }
      })
      .filter(Boolean)
  }, [battleOverTime])

  const cosmonsNonEvolved = battleOverTime?.me.cosmonsWithoutBonus

  return (
    <div className="flex flex-col items-center">
      <p className="text-white">Cosmon evolution</p>
      <div className="mt-[20px] flex w-full flex-col justify-center gap-[20px] rounded-[20px] bg-[#282255] py-[32px] px-[40px]">
        {cosmonsNonEvolved?.map((cosmonNonEvolved, i) => (
          <CosmonProgression
            iWin={battleOverTime?.winner.identity.includes(battleOverTime.me.identity) ?? false}
            key={cosmonNonEvolved.id}
            cosmon={cosmonNonEvolved}
            cosmonEvolved={cosmonsEvolved![i]!}
          />
        ))}
      </div>
      <div
        className="absolute bottom-0 flex justify-center"
        data-tip="tootlip"
        data-for={`no-fp-available`}
        style={{ bottom: '-17.2%', right: '29%' }}
      >
        <Button
          size="small"
          type="secondary"
          onClick={onClickNewFight}
          disabled={cosmonsEvolved?.some((c) => +getCosmonStat(c!.stats!, 'Fp')?.value! === 0)}
        >
          <h2 style={{ fontSize: 14, lineHeight: '26px' }}>New Fight !</h2>
        </Button>
      </div>
      {cosmonsEvolved?.some((c) => +getCosmonStat(c!.stats!, 'Fp')?.value! === 0) ? (
        <Tooltip id={`no-fp-available`} place="top">
          <p>No more Fight Points available</p>
        </Tooltip>
      ) : null}
    </div>
  )
}

export default CosmonsProgression

interface CosmonProgressionProps {
  cosmon: CosmonType
  cosmonEvolved: CosmonType
  iWin: boolean
}

const CosmonProgression: React.FC<CosmonProgressionProps> = ({ cosmon, cosmonEvolved, iWin }) => {
  return (
    <div className="flex">
      <div style={{ border: '1px solid #555', padding: 3, borderRadius: 4 }}>
        <CosmonCard cosmon={cosmon} style={{ width: 90, height: 151 }} />
      </div>
      <div className="ml-[20px] flex flex-1 flex-col justify-center">
        <CosmonXpProgression
          iWin={iWin}
          levelStat={+getCosmonStat(cosmon.stats!, 'Level')!.value!}
          levelStatEvolved={+getCosmonStat(cosmonEvolved.stats!, 'Level')!.value!}
          xpStat={+getCosmonStat(cosmon.stats!, 'Xp')!.value!}
          xpStatEvolved={+getCosmonStat(cosmonEvolved.stats!, 'Xp')!.value!}
          xpNextLevel={
            +getCosmonStat(cosmon.stats!, 'Next Level')?.value! ||
            +getCosmonStat(cosmonEvolved.stats!, 'Next Level')?.value!
          }
          xpNextLevelEvolved={+getCosmonStat(cosmonEvolved.stats!, 'Next Level')?.value! || 0}
          floorXpEvolved={+getCosmonStat(cosmonEvolved.stats!, 'Floor Level')?.value! || 0}
        />

        <div className="mt-[16px] grid grid-cols-2 gap-x-[24px] gap-y-[8px]">
          <CosmonStatProgression
            key={`${cosmon.id}-Atq`}
            statKey="Atq"
            stats={cosmon.stats!}
            statsEvolved={cosmonEvolved.stats!}
          />
          <CosmonStatProgression
            key={`${cosmon.id}-Def`}
            statKey="Def"
            stats={cosmon.stats!}
            statsEvolved={cosmonEvolved.stats!}
          />
          <CosmonStatProgression
            key={`${cosmon.id}-Spe`}
            statKey="Spe"
            stats={cosmon.stats!}
            statsEvolved={cosmonEvolved.stats!}
          />
          <CosmonStatProgression
            key={`${cosmon.id}-Hp`}
            statKey="Hp"
            stats={cosmon.stats!}
            statsEvolved={cosmonEvolved.stats!}
          />
          <CosmonStatProgression
            key={`${cosmon.id}-Luk`}
            statKey="Luk"
            stats={cosmon.stats!}
            statsEvolved={cosmonEvolved.stats!}
          />
          <CosmonStatProgression
            key={`${cosmon.id}-Int`}
            statKey="Int"
            stats={cosmon.stats!}
            statsEvolved={cosmonEvolved.stats!}
          />
        </div>
      </div>
    </div>
  )
}

interface CosmonXpProgressionProps {
  iWin: boolean
  levelStat: number
  levelStatEvolved: number
  xpStat: number
  xpStatEvolved: number
  xpNextLevel: number
  xpNextLevelEvolved: number
  floorXpEvolved: number
}

const CosmonXpProgression: React.FC<CosmonXpProgressionProps> = ({
  iWin,
  levelStat,
  levelStatEvolved,
  xpStat,
  xpStatEvolved,
  xpNextLevel,
  xpNextLevelEvolved,
  floorXpEvolved,
}) => {
  const [currentXp, setCurrentXp] = useState<number>(0)
  const [currentLevel, setCurrentLevel] = useState(levelStat)
  const [currentXpMax, setCurrentXpMax] = useState(xpNextLevel - floorXpEvolved)
  const [levelUp, setLevelUp] = useState(false)

  const currentXpPercent = useMemo(() => {
    const xpPercent =
      ((xpStatEvolved - floorXpEvolved) / (xpNextLevelEvolved - floorXpEvolved)) * 100
    return xpPercent
  }, [xpStatEvolved, floorXpEvolved, xpNextLevelEvolved])

  useMount(() => {
    if (levelStat === levelStatEvolved) {
      setCurrentXp(xpStatEvolved - floorXpEvolved)
    } else {
      setLevelUp(true)
      setCurrentXp(xpStatEvolved - floorXpEvolved)
      setCurrentXpMax(xpNextLevelEvolved - floorXpEvolved)
      setCurrentLevel(levelStatEvolved)

      setTimeout(() => {
        setLevelUp(false)
      }, 2000)
    }
  })

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between">
        <div className="relative flex">
          <p className="text-sm font-normal text-white">Level {currentLevel}</p>
          {xpStatEvolved > xpStat ? (
            <CosmonStatProgressionLabel
              className="ml-[12px]"
              label={`+${xpStatEvolved - xpStat}XP`}
            />
          ) : null}
        </div>
        <p className="relative">
          {currentXp}
          <span className="text-sm font-normal">/{currentXpMax}</span>
          <AnimatePresence>
            {levelUp ? (
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  scale: [1, 1.1],
                  y: [-20, -40],
                  transition: {
                    delay: 0.5,
                    duration: 2,
                  },
                }}
                style={{ position: 'absolute', top: 0, right: 0, zIndex: 950 }}
              >
                <span className={clsx('whitespace-nowrap text-sm font-normal text-[#0DBB81]')}>
                  Level Up !
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </p>
      </div>
      <div className="relative mt-[8px] h-[6px] w-full overflow-hidden rounded-[6px]">
        {iWin ? (
          <motion.div
            className="absolute top-0 left-0 h-full"
            animate={{ width: `${currentXpPercent}%`, transition: { duration: 2 } }}
            style={{ background: '#D9D9D9', zIndex: 2 }}
          />
        ) : (
          <div
            className="absolute top-0 left-0 h-full"
            style={{ background: '#D9D9D9', zIndex: 2, width: `${currentXpPercent}%` }}
          />
        )}
        <div
          className="absolute top-0 left-0 h-full w-full"
          style={{ background: 'rgba(217, 217, 217, 0.3)', zIndex: 1 }}
        />
      </div>
    </div>
  )
}

interface CosmonStatProgressionProps {
  statKey: CosmonStatKeyType
  stats: CosmonStatType[]
  statsEvolved: CosmonStatType[]
}

const CosmonStatProgression: React.FC<CosmonStatProgressionProps> = ({
  statKey,
  stats,
  statsEvolved,
}) => {
  const statLabel = useMemo(() => {
    switch (statKey) {
      case 'Atq':
        return 'Attack (ATK)'
      case 'Def':
        return 'Defense (DEF)'
      case 'Spe':
        return 'Speed (SPE)'
      case 'Int':
        return 'Intelligence (INT)'
      case 'Luk':
        return 'Chance (LUK)'
      case 'Hp':
        return 'Health Points (HP)'
      default:
        return ''
    }
  }, [statKey])

  return (
    <div className="flex flex-1 justify-between">
      <p className="text-sm font-normal">{statLabel}</p>
      <p className="text-sm">
        {getCosmonStat(statsEvolved, statKey)?.value}
        {getCosmonStat(statsEvolved, statKey)?.value! > getCosmonStat(stats, statKey)?.value! ? (
          <CosmonStatProgressionLabel
            className="ml-[4px]"
            label={`+${
              getCosmonStat(statsEvolved, statKey)?.value! - getCosmonStat(stats, statKey)?.value!
            }`}
          />
        ) : null}
      </p>
    </div>
  )
}

interface CosmonStatProgressionLabelProps {
  label: ReactNode
  className?: string
}

const CosmonStatProgressionLabel: React.FC<CosmonStatProgressionLabelProps> = ({
  label,
  className,
}) => {
  return <span className={clsx('text-sm font-normal text-[#0DBB81]', className)}>{label}</span>
}
