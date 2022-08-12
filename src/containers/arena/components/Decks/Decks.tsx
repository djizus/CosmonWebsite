import { Deck } from '@services/deck'
import { useDeckStore } from '@store/deckStore'
import { useWalletStore } from '@store/walletStore'
import { AnimatePresence } from 'framer-motion'
import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { FightModeType, FightRequestType } from 'types/FightMode'
import TrainingModeDescriptionModal from '../TrainingModeDescriptionModal'
import DecksEmptyList from './DecksEmptyList'
import DecksList from './DecksList'

interface DecksProps {
  onEditDeck: (deck: Deck) => void
  onDeleteDeck: (deck: Deck) => void
}

const Decks: React.FC<DecksProps> = ({ onEditDeck, onDeleteDeck }) => {
  const { isConnected, cosmons } = useWalletStore((state) => state)
  const { decksList, fetchDecksList, fetchPersonalityAffinities } =
    useDeckStore((state) => state)

  const [fightRequest, setFightRequest] = useState<
    FightRequestType | undefined
  >()

  useEffect(() => {
    if (isConnected) {
      fetchPersonalityAffinities()
    }
  }, [isConnected])

  useEffect(() => {
    if (cosmons && cosmons.length) {
      fetchDecksList()
    }
  }, [cosmons])

  const handleLaunchFight = useCallback(
    (deck: Deck, fightMode: FightModeType) => {
      setFightRequest({ deck, fightMode })
    },
    []
  )

  const handleStartFight = useCallback(() => {}, [])

  return (
    <div className="min-h-[400px]">
      {decksList?.length > 0 ? (
        <div className="mt-[40px]">
          <DecksList
            decksList={decksList}
            onEditDeck={onEditDeck}
            onDeleteDeck={onDeleteDeck}
            onLaunchFight={handleLaunchFight}
          />
        </div>
      ) : (
        <DecksEmptyList />
      )}
      <AnimatePresence>
        {fightRequest?.fightMode === 'training' ? (
          <TrainingModeDescriptionModal
            onCloseModal={() => {
              setFightRequest(undefined)
            }}
            onSliderEndReached={handleStartFight}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default Decks
