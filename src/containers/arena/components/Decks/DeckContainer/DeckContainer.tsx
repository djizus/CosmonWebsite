import Button from '@components/Button/Button'
import { Deck, CosmonType } from 'types'
import { useDeckStore } from '@store/deckStore'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useMemo, useState } from 'react'
import DeckDropdownMenu from './DeckDropdownMenu'
import DeckAffinities from '../../DeckAffinities/DeckAffinities'
import CosmonFullModal from '@components/Modal/CosmonFullModal'
import CosmonFightPointsBar from '@components/Cosmon/CosmonFightPointsBar'
import { getCosmonStat } from '@utils/cosmon'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import EditIcon from '@public/icons/edit.svg'
import FlipIcon from '@public/icons/flip.svg'
import CosmonStatsCard from '@components/Cosmon/CosmonCard/CosmonStatsCard'
import FlipCard from '@components/FlipCard/FlipCard'
import Countdown from '@components/Countdown/Countdown'
import { useArenaStore } from '@store/arenaStore'

interface DeckContainerProps {
  deck: Deck
  onEditDeck: (deck: Deck) => void
  onClickDelete: (deck: Deck) => void
  onClickFight: (deck: Deck) => void
}

const DeckContainer: React.FC<DeckContainerProps> = ({
  deck,
  onEditDeck,
  onClickDelete,
  onClickFight,
}) => {
  const { computeDeckAffinities } = useDeckStore()
  const [showCosmonDetail, set_showCosmonDetail] = useState<CosmonType | null>()
  const [revealCards, setRevealCards] = useState(true)
  const { refreshCosmonsAndDecksList } = useDeckStore()
  const { hourlyFPNumber } = useArenaStore()

  const affinities = useMemo(() => {
    return computeDeckAffinities(deck.cosmons)
  }, [deck])

  const onClickEditDeck = useCallback(() => {
    onEditDeck(deck)
  }, [deck, onEditDeck])

  const onClickDeleteDeck = useCallback(() => {
    onClickDelete(deck)
  }, [deck, onClickDelete])

  const handleClickOnFight = useCallback(() => {
    onClickFight(deck)
  }, [deck, onClickFight])

  const onClickFlipCards = useCallback(() => {
    setRevealCards((prev) => !prev)
  }, [])

  const missFp = useMemo(() => {
    if (deck) {
      return deck.cosmons.some((c) => +getCosmonStat(c.stats!, 'Fp')?.value! === 0)
    }
  }, [deck])

  const nextHourDate = useMemo(() => {
    const now = new Date()
    const nextHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      0,
      20 // we add 20 sec to let the script that refill FPs to run
    )
    return nextHour
  }, [])

  const handleCountdownReached = async () => {
    await refreshCosmonsAndDecksList()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.2 } }}
      exit={{ opacity: 0 }}
      className="w-full overflow-visible rounded-[16px] bg-cosmon-main-quaternary px-[20px] py-[16px] transition-all hover:bg-[#29264B] lg:py-[24px] lg:px-[32px]"
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between ">
          <div className="flex flex-col items-start overflow-hidden  whitespace-nowrap">
            <p className="text-white">Team</p>
            <p className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-xl font-semibold text-white lg:max-w-full">
              {deck.name}
            </p>
          </div>
          <div className="flex items-center">
            <DeckAffinities deckAffinities={affinities} variant="short" />
            <div className="hidden lg:flex">
              <DeckDropdownMenu onClickDeleteDeck={onClickDeleteDeck} />
            </div>
          </div>
        </div>
        <div
          className="mt-[30px] grid w-full grid-cols-3 gap-[18px] lg:gap-[32px]"
          style={{ aspectRatio: '1.7' }}
        >
          {deck.cosmons.map((cosmon) => (
            <div key={`image-${deck.id}-${cosmon.id}`} className="flex h-full w-full flex-col">
              <FlipCard
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
                cardBack={<CosmonStatsCard cosmon={cosmon} />}
                revealed={revealCards}
                className="cursor-pointer"
                onClick={() => {
                  set_showCosmonDetail(cosmon)
                }}
              />

              <CosmonFightPointsBar className="mt-[16px]" cosmon={cosmon} />
            </div>
          ))}
        </div>
        <div className="mt-[30px] flex flex-1 gap-[12px]">
          <div className="w-full lg:w-3/4">
            <Button
              onClick={handleClickOnFight}
              disabled={missFp}
              type="primary"
              size="small"
              fullWidth
            >
              {missFp ? (
                <p>
                  +{hourlyFPNumber} Fight Points in &nbsp;
                  <Countdown
                    from={new Date()}
                    to={nextHourDate}
                    tag="span"
                    onCountdownReached={handleCountdownReached}
                  />
                </p>
              ) : (
                'Fight'
              )}
            </Button>
          </div>
          <div className="hidden w-1/4 gap-[12px] lg:flex">
            <Button
              type="primaryBordered"
              size="small"
              fullWidth
              active={!revealCards}
              onClick={onClickFlipCards}
            >
              <FlipIcon />
            </Button>
            <Button type="primaryBordered" size="small" fullWidth onClick={onClickEditDeck}>
              <EditIcon />
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
        {showCosmonDetail && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              top: 0,
              left: 0,
              zIndex: 1000,
            }}
          >
            <CosmonFullModal
              onCloseModal={() => set_showCosmonDetail(null)}
              cosmon={showCosmonDetail && showCosmonDetail}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default DeckContainer

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}
