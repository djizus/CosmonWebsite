import Button from '@components/Button/Button'
import { Deck, CosmonType } from 'types'
import { useDeckStore } from '@store/deckStore'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useMemo, useState } from 'react'
import DeckDropdownMenu from './DeckDropdownMenu'
import Hover from 'react-3d-hover'
import DeckAffinities from '../../DeckAffinities/DeckAffinities'
import CosmonFullModal from '@components/Modal/CosmonFullModal'
import CosmonFightPointsBar from '@components/Cosmon/CosmonFightPointsBar'

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.2 } }}
      exit={{ opacity: 0 }}
      className="w-full overflow-visible rounded-[16px] bg-cosmon-main-quaternary px-[32px] py-[24px] transition-all hover:bg-[#29264B]"
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-white ">Team</p>
            <p className="text-xl font-semibold text-white">{deck.name}</p>
          </div>
          <div className="flex items-center">
            <DeckAffinities deckAffinities={affinities} variant="short" />
            <DeckDropdownMenu onClickDeleteDeck={onClickDeleteDeck} />
          </div>
        </div>
        <div className="mt-[30px] flex">
          <div className="grid w-full grid-cols-3 gap-[30px]">
            {deck.cosmons.map((cosmon) => (
              <div
                key={`image-${deck.id}-${cosmon.id}`}
                className="flex h-full w-full flex-col"
              >
                <Hover perspective={300} speed={5}>
                  <img
                    src={cosmon.data.extension.image}
                    onClick={() => {
                      set_showCosmonDetail(cosmon)
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      cursor: 'pointer',
                    }}
                  />
                </Hover>
                <CosmonFightPointsBar className="mt-[16px]" cosmon={cosmon} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[30px] flex flex-1 gap-[12px]">
          <div className="w-3/4">
            <Button
              onClick={handleClickOnFight}
              type="primary"
              size="small"
              fullWidth
            >
              Fight
            </Button>
          </div>
          <div className="w-1/4">
            <Button
              type="secondary"
              size="small"
              fullWidth
              onClick={onClickEditDeck}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => null}
      >
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
