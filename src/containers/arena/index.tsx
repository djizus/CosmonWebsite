import Button from '@components/Button/Button'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import { Deck } from '@services/deck'
import { useDeckStore } from '@store/deckStore'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import { useCallback } from 'react'
import DeckBuilderModal from './components/DeckBuilder/DeckBuilderModal'
import Decks from './components/Decks/Decks'
import DeleteDeckModal from './components/DeleteDeckModal'
import MEA from './components/MEA/MEA'
import Progression from './components/Progression/Progression'

interface ArenaProps {}

type ViewType = 'decks' | 'progression'

const Arena: React.FC<ArenaProps> = ({}) => {
  const [view, setView] = useState<ViewType>('decks')
  const [deckBuilderVisible, setDeckBuilderVisible] = useState(false)
  const [deckToEdit, setDeckToEdit] = useState<Deck | undefined>()
  const [deckToDelete, setDeckToDelete] = useState<Deck | undefined>()
  const { removeDeck, isRemovingDeck } = useDeckStore()

  const handleClickDeck = useCallback(() => {
    setView('decks')
  }, [])

  const handleClickProgression = useCallback(() => {
    setView('progression')
  }, [])

  const handleClickEditDeck = useCallback((deck: Deck) => {
    setDeckToEdit(deck)
    handleOpenDeckBuilderModal()
  }, [])

  const handleDeletetDeck = useCallback((deck: Deck) => {
    setDeckToDelete(deck)
  }, [])

  const renderCurrentView = useMemo(() => {
    switch (view) {
      case 'decks':
        return (
          <Decks
            onEditDeck={handleClickEditDeck}
            onDeleteDeck={handleDeletetDeck}
          />
        )
      case 'progression':
        return <Progression />
    }
  }, [view])

  const handleCloseDeckBuilderModal = useCallback(() => {
    setDeckBuilderVisible(false)
  }, [])

  const handleOpenDeckBuilderModal = useCallback(() => {
    setDeckBuilderVisible(true)
  }, [])

  const handleConfirmDeleteDeck = useCallback(async () => {
    try {
      if (deckToDelete) {
        const resp = await removeDeck(deckToDelete?.id)

        if (!isRemovingDeck && resp) {
          setDeckToDelete(undefined)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [deckToDelete, isRemovingDeck])

  return (
    <div className="pt-[100px] lg:pt-[132px]">
      <div className="relative h-[380px] bg-cosmon-main-quaternary">
        <div className="flex h-full items-center justify-center gap-x-[54px]">
          <MEA
            imgSrc="/arena/bg-cosmon.png"
            title="Announcement 1"
            subtitle="Subtitle"
          />
          <MEA
            imgSrc="/arena/bg-article-trainings.png"
            title="Announcement 2"
            subtitle="Subtitle"
          />
          <MEA
            imgSrc="/arena/bg-article-tournament.png"
            title="Announcement 3"
            subtitle="Subtitle"
          />
        </div>
      </div>

      <ConnectionNeededContent>
        <div className="max-w-auto px-2 pt-[80px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-row">
              <Button type="quaternary" size="small" onClick={handleClickDeck}>
                My Decks
              </Button>
              <Button
                type="quaternary"
                disabled
                size="small"
                className="ml-[32px]"
                onClick={handleClickProgression}
              >
                Progression <span className="font-thin">(Coming soon)</span>
              </Button>
            </div>
            <div>
              <Button size="small" onClick={handleOpenDeckBuilderModal}>
                Add a new deck
              </Button>
            </div>
          </div>

          <div>{renderCurrentView}</div>
          <AnimatePresence
            initial={false}
            exitBeforeEnter={true}
            onExitComplete={() => null}
          >
            {deckBuilderVisible ? (
              <DeckBuilderModal
                deckToEdit={deckToEdit}
                handleCloseModal={handleCloseDeckBuilderModal}
              />
            ) : null}
          </AnimatePresence>

          {deckToDelete ? (
            <DeleteDeckModal
              deck={deckToDelete}
              onConfirmDelete={handleConfirmDeleteDeck}
              loading={isRemovingDeck}
              onCloseModal={() => {
                setDeckToDelete(undefined)
              }}
            />
          ) : null}
        </div>
      </ConnectionNeededContent>
    </div>
  )
}

export default Arena
