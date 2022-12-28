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
import BuyBoostModal from './components/BuyBoostModal/BuyBoostModal'
import { BuyBoostModalOrigin } from './components/BuyBoostModal/BuyBoostModalType'
import DeckBuilderModal from './components/DeckBuilder/DeckBuilderModal'
import Decks from './components/Decks/Decks'
import DeleteDeckModal from './components/DeleteDeckModal'
import Progression from './components/Progression/Progression'
import * as style from './components/Hero/style.module.scss'
import Hero from './components/Hero/Hero'
import { useWalletStore } from '@store/walletStore'

interface ArenaProps {}

type ViewType = 'decks' | 'progression'

const Arena: React.FC<ArenaProps> = ({}) => {
  const [view, setView] = useState<ViewType>('decks')
  const [deckBuilderVisible, setDeckBuilderVisible] = useState(false)
  const [buyBoostVisible, setBuyBoostVisible] = useState(false)
  const [deckToEdit, setDeckToEdit] = useState<Deck | undefined>()
  const [deckToDelete, setDeckToDelete] = useState<Deck | undefined>()
  const [buyBoostModalOrigin, setBuyBoostModalOrigin] = useState<BuyBoostModalOrigin | null>(null)
  const { removeDeck, isRemovingDeck } = useDeckStore()
  const { arenasList, fetchArenasList } = useGameStore()
  const { cosmons, cosmonsId } = useWalletStore()
  const { currentLeaguePro, getNextLeagueOpenTime, getPrizePool, setCurrentLeaguePro } =
    useArenaStore()

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

  const handleCloseDeckBuilderModal = useCallback(() => {
    setDeckToEdit(undefined)
    setDeckBuilderVisible(false)
  }, [])

  const handleOpenDeckBuilderModal = useCallback(() => {
    setDeckBuilderVisible(true)
  }, [])

  const handleOpenBuyBoostModal = useCallback(
    (origin: BuyBoostModalOrigin) => {
      setBuyBoostVisible(true)
      setBuyBoostModalOrigin(origin)
    },
    [buyBoostModalOrigin]
  )

  const handleCloseBuyBoostModal = useCallback(() => {
    setBuyBoostVisible(false)
    setBuyBoostModalOrigin(null)
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

  const renderCurrentView = useMemo(() => {
    switch (view) {
      case 'decks':
        return (
          <Decks
            onOpenBoostModal={handleOpenBuyBoostModal}
            onEditDeck={handleClickEditDeck}
            onDeleteDeck={handleDeletetDeck}
          />
        )
      case 'progression':
        // currentLeaguePro can't be null because if it is null we can't display it
        return <Progression currentLeaguePro={currentLeaguePro as ArenaType} />
    }
  }, [view])

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
            <div className={style.optionsContainer}>
              {cosmons.length === cosmonsId.length ? (
                <Button
                  size="small"
                  onClick={() => handleOpenBuyBoostModal('buyBoost')}
                  className={style.buyBoostButton}
                >
                  Buy a boost
                </Button>
              ) : null}
              <Button size="small" onClick={handleOpenDeckBuilderModal}>
                Add a new deck
              </Button>
            </div>
          </div>

          <div className="border-shiny-gradient mt-[35px] h-auto w-full rounded-xl bg-cosmon-main-secondary py-5 px-5 lg:hidden">
            <p className="text-sm">
              To create, edit or delete a deck, please go the desktop version to experience Cosmon
              in the best possible way.
            </p>
          </div>

          <div>{renderCurrentView}</div>
          <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
            {buyBoostVisible && buyBoostModalOrigin ? (
              <BuyBoostModal
                origin={buyBoostModalOrigin}
                handleCloseModal={handleCloseBuyBoostModal}
              />
            ) : null}
          </AnimatePresence>
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
