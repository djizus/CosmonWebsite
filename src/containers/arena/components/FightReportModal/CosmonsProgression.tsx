import { useGameStore } from '@store/gameStore'
import { useWalletStore } from '@store/walletStore'
import { getCosmonStat } from '@utils/cosmon'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode, useMemo, useState } from 'react'
import { useMount } from 'react-use'
import { CosmonStatKeyType, CosmonStatType, CosmonType } from 'types'

interface CosmonsProgressionProps {}

const CosmonsProgression: React.FC<CosmonsProgressionProps> = () => {
  const { cosmons } = useWalletStore()
  const { battle } = useGameStore()

  const cosmonsEvolved = useMemo(() => {
    return battle?.me.cosmonsWithoutBonus
      .map((c) => {
        const pos = cosmons.findIndex((cosmon) => cosmon.id === c.id)
        if (pos !== -1) {
          return cosmons[pos]
        }
      })
      .filter(Boolean)
  }, [battle])

  const cosmonsNonEvolved = battle?.me.cosmonsWithoutBonus

  return (
    <div className="flex flex-col items-center">
      <p className="text-white">Cosmon evolution</p>
      <div className="mt-[20px] flex w-full flex-col justify-center gap-[20px] rounded-[20px] bg-[#282255] py-[32px] px-[40px]">
        {cosmonsNonEvolved?.map((cosmonNonEvolved, i) => (
          <CosmonProgression
            iWin={battle?.winner.identity.includes(battle.me.identity) ?? false}
            key={cosmonNonEvolved.id}
            cosmon={cosmonNonEvolved}
            cosmonEvolved={cosmonsEvolved![i]!}
          />
        ))}
      </div>
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
      <div>
        <img src={cosmon.data.extension.image} width={90} style={{ position: 'relative' }} />
      </div>
      <div className="ml-[20px] flex flex-1 flex-col justify-center">
        <CosmonXpProgression
          iWin={iWin}
          levelStat={+getCosmonStat(cosmon.stats!, 'Level')!.value!}
          levelStatEvolved={+getCosmonStat(cosmonEvolved.stats!, 'Level')!.value!}
          xpStat={+getCosmonStat(cosmon.stats!, 'Xp')!.value!}
          xpStatEvolved={+getCosmonStat(cosmonEvolved.stats!, 'Xp')!.value!}
          xpNextLevel={+getCosmonStat(cosmon.stats!, 'Next Level')?.value! || 0}
          xpNextLevelEvolved={+getCosmonStat(cosmonEvolved.stats!, 'Next Level')?.value! || 0}
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
            key={`${cosmon.id}-Psy`}
            statKey="Psy"
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
}

const CosmonXpProgression: React.FC<CosmonXpProgressionProps> = ({
  iWin,
  levelStat,
  levelStatEvolved,
  xpStat,
  xpStatEvolved,
  xpNextLevel,
  xpNextLevelEvolved,
}) => {
  const [currentXpPercent, setCurrentXpPercent] = useState<number>(
    iWin ? (xpStatEvolved / xpNextLevelEvolved) * 100 : (xpStatEvolved / xpNextLevelEvolved) * 100 // will animate from 0 only if i win
  )
  const [currentXp, setCurrentXp] = useState<number>(0)
  const [currentLevel, setCurrentLevel] = useState(levelStat)
  const [currentXpMax, setCurrentXpMax] = useState(xpNextLevel)
  const [levelUp, setLevelUp] = useState(false)

  useMount(() => {
    if (levelStat === levelStatEvolved) {
      setCurrentXp(xpStatEvolved)
      setTimeout(() => {
        setCurrentXpPercent((xpStatEvolved / xpNextLevelEvolved) * 100)
      }, 1000)
    } else {
      setLevelUp(true)
      setCurrentXp(xpStatEvolved)
      setCurrentXpPercent((xpStatEvolved / xpNextLevelEvolved) * 100)
      setCurrentXpMax(xpNextLevelEvolved)
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
      case 'Psy':
        return 'Psychology (PSY)'
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
