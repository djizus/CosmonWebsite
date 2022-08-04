import { Deck } from '@services/deck'
import { useDeckStore } from '@store/deckStore'
import { useWalletStore } from '@store/walletStore'
import React from 'react'
import { useEffect } from 'react'
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

  return (
    <div className="min-h-[400px]">
      {decksList?.length > 0 ? (
        <div className="mt-[40px]">
          <DecksList
            decksList={decksList}
            onEditDeck={onEditDeck}
            onDeleteDeck={onDeleteDeck}
          />
        </div>
      ) : (
        <DecksEmptyList />
      )}
    </div>
  )
}

export default Decks
