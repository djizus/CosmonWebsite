import { Deck } from '@services/deck'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { FightModeType } from 'types/FightMode'
import DeckContainer from './DeckContainer/DeckContainer'

interface DecksListProps {
  decksList: Deck[]
  onEditDeck: (deck: Deck) => void
  onDeleteDeck: (deck: Deck) => void
  onLaunchFight: (deck: Deck, fightMode: FightModeType) => void
}

const DecksList: React.FC<DecksListProps> = ({
  decksList,
  onEditDeck,
  onDeleteDeck,
  onLaunchFight,
}) => {
  return (
    <div className="grid w-full grid-cols-2 gap-[32px] overflow-visible">
      <AnimatePresence>
        {decksList.map((deck) => (
          <DeckContainer
            key={`deck-${deck.id}`}
            deck={deck}
            onEditDeck={onEditDeck}
            onClickDelete={onDeleteDeck}
            onLaunchFight={onLaunchFight}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default DecksList
