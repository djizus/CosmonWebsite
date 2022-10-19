import Button from '@components/Button/Button'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import { useDeckStore } from '@store/deckStore'
import { useGameStore } from '@store/gameStore'
import { useArenaStore } from '@store/arenaStore'
import clsx from 'clsx'
import isAfter from 'date-fns/isAfter'
import { AnimatePresence } from 'framer-motion'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { ArenaType, Deck } from 'types'
import DeckBuilderModal from './components/DeckBuilder/DeckBuilderModal'
import Decks from './components/Decks/Decks'
import DeleteDeckModal from './components/DeleteDeckModal'
import Progression from './components/Progression/Progression'
import * as style from './components/Hero/style.module.scss'
import Hero from './components/Hero/Hero'

interface ArenaProps {}

type ViewType = 'decks' | 'progression'

const Arena: React.FC<ArenaProps> = ({}) => {
  const [view, setView] = useState<ViewType>('decks')
  const [deckBuilderVisible, setDeckBuilderVisible] = useState(false)
  const [deckToEdit, setDeckToEdit] = useState<Deck | undefined>()
  const [deckToDelete, setDeckToDelete] = useState<Deck | undefined>()
  const { removeDeck, isRemovingDeck } = useDeckStore()
  const { arenasList, fetchArenasList } = useGameStore()
  const { currentLeaguePro, setCurrentLeaguePro } = useArenaStore()

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
        return <Decks onEditDeck={handleClickEditDeck} onDeleteDeck={handleDeletetDeck} />
      case 'progression':
        // currentLeaguePro can't be null because if it is null we can't display it
        return <Progression currentLeaguePro={currentLeaguePro as ArenaType} />
    }
  }, [view])

  const handleCloseDeckBuilderModal = useCallback(() => {
    setDeckToEdit(undefined)
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

  useEffect(() => {
    if (arenasList?.length > 0) {
      // @TODO: we will need to update this part for the second league
      const leaguePro = arenasList.filter((a) => a.name !== 'Training')[0]
      if (leaguePro) {
        const startTimestamp = leaguePro.arena_open_time
        const startEpoch = new Date(0)
        startEpoch.setUTCSeconds(startTimestamp)
        if (isAfter(new Date(), startEpoch)) {
          setCurrentLeaguePro(leaguePro)
        }
      }
    } else {
      // we have to put this in a place (method) where the whole app bootstraps
      fetchArenasList()
    }
  }, [arenasList])

  return (
    <div className="pt-[100px] lg:pt-[132px]">
      <Hero />
      <ConnectionNeededContent>
        <div className="max-w-auto px-[20px] pt-[80px] lg:px-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-row">
              <Button
                className={clsx(style.button, {
                  [style.activeButton]: view === 'decks',
                })}
                type="quaternary"
                size="small"
                onClick={handleClickDeck}
                active
              >
                My Decks
              </Button>
              <Button
                type="quaternary"
                size="small"
                className={clsx('ml-[32px]', style.button, {
                  [style.activeButton]: view === 'progression',
                })}
                onClick={handleClickProgression}
                disabled={!currentLeaguePro}
              >
                Progression
              </Button>
            </div>
            <div className="hidden lg:block">
              <Button size="small" onClick={handleOpenDeckBuilderModal}>
                Add a new deck
              </Button>
            </div>
          </div>

          <div>{renderCurrentView}</div>
          <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
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
