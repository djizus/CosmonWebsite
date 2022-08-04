import Button from '@components/Button/Button'
import { Deck } from '@services/deck'
import { useDeckStore } from '@store/deckStore'
import { motion } from 'framer-motion'
import React, { useCallback, useMemo } from 'react'
import DeckDropdownMenu from './DeckDropdownMenu'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Hover from 'react-3d-hover'
import DeckAffinities from '../../DeckAffinities/DeckAffinities'

interface DeckContainerProps {
  deck: Deck
  onEditDeck: (deck: Deck) => void
  onClickDelete: (deck: Deck) => void
}

const DeckContainer: React.FC<DeckContainerProps> = ({
  deck,
  onEditDeck,
  onClickDelete,
}) => {
  const { computeDeckAffinities } = useDeckStore()

  const affinities = useMemo(() => {
    return computeDeckAffinities(deck.cosmons)
  }, [deck])

  const onClickEditDeck = useCallback(() => {
    onEditDeck(deck)
  }, [deck, onEditDeck])

  const onClickDeleteDeck = useCallback(() => {
    onClickDelete(deck)
  }, [deck, onClickDelete])

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
          <div className="shadow-orange grid grid-cols-3 gap-[30px]">
            {deck.cosmons.map((cosmon) => (
              <Hover
                key={`image-${deck.id}-${cosmon.id}`}
                perspective={300}
                speed={5}
              >
                <img
                  src={cosmon.data.extension.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Hover>
            ))}
          </div>
        </div>
        <div className="mt-[30px] flex flex-1 gap-[12px]">
          <div className="w-3/4">
            <Button disabled type="primary" size="small" fullWidth>
              Fight (Coming soon)
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
    </motion.div>
  )
}

export default DeckContainer
