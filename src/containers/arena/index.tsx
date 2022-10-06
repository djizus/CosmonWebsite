import Button from '@components/Button/Button'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import Countdown from '@components/Countdown/Countdown'
import UnmaskOnReach from '@components/UnmaskOnReach/UnmaskOnReach'
import { getMEAs } from '@containers/arena/data'
import { Coin } from '@cosmjs/proto-signing'
import { useArenaStore } from '@store/arenaStore'
import { useDeckStore } from '@store/deckStore'
import { useGameStore } from '@store/gameStore'
import { convertMicroDenomToDenom } from '@utils/conversion'
import clsx from 'clsx'
import { AnimatePresence } from 'framer-motion'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { ArenaType, Deck } from 'types'
import DeckBuilderModal from './components/DeckBuilder/DeckBuilderModal'
import Decks from './components/Decks/Decks'
import DeleteDeckModal from './components/DeleteDeckModal'
import MEA from './components/MEA/MEA'
import Progression from './components/Progression/Progression'
import * as style from './style.module.scss'

interface ArenaProps {}

type ViewType = 'decks' | 'progression'

const Arena: React.FC<ArenaProps> = ({}) => {
  const [view, setView] = useState<ViewType>('decks')
  const [deckBuilderVisible, setDeckBuilderVisible] = useState(false)
  const [deckToEdit, setDeckToEdit] = useState<Deck | undefined>()
  const [deckToDelete, setDeckToDelete] = useState<Deck | undefined>()
  const { removeDeck, isRemovingDeck } = useDeckStore()
  const [nextLeagueStartDate, setNextLeagueStartDate] = useState<Date>()
  const { arenasList } = useGameStore()
  const { fetchNextPrizePool } = useArenaStore()
  const [prize, setPrize] = useState<Coin>()
  const [currentLeaguePro, setCurrentLeaguePro] = useState<ArenaType | null>(null)
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
        setCurrentLeaguePro(leaguePro)
        fetchLeagueProPrizePool(leaguePro.contract)
        const startTimestamp = leaguePro.arena_open_time
        const startEpoch = new Date(0)
        startEpoch.setUTCSeconds(startTimestamp)
        setNextLeagueStartDate(startEpoch)
      }
    }
  }, [arenasList])

  const fetchLeagueProPrizePool = async (leagueProContractAddress: string) => {
    try {
      const prize = await fetchNextPrizePool(leagueProContractAddress)
      setPrize(prize[0])
    } catch (error) {}
  }

  return (
    <div className="pt-[100px] lg:pt-[132px]">
      <div className="relative h-[380px] bg-cosmon-main-quaternary">
        <div className="flex h-full items-center justify-center gap-x-[54px]">
          {getMEAs().map((mea, i) => (
            <UnmaskOnReach key={`mea-${i}`} delay={(i + 1) * 0.18}>
              <MEA {...mea} />
            </UnmaskOnReach>
          ))}
          <UnmaskOnReach key={`mea-next-season`} delay={2 * 0.18}>
            <div
              style={{
                position: 'relative',
                background: 'url(/mea-bg-outline.png) top left no-repeat',
                backgroundSize: 'cover',
                height: 235,
                width: 600,
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 1,
                  left: 1,
                  right: 1,
                  bottom: 1,
                  width: 'calc(100% - 2px)',
                  height: 'calc(100% - 2px)',
                  background: 'url(/mea-bg.png) top left no-repeat',
                  backgroundSize: 'contain',
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: 52,
                  paddingTop: 52,
                }}
              >
                <div className="flex self-start">
                  <h2 className="text-[34px] leading-[26px]">Season #1</h2>
                </div>
                <div className="flex items-center ">
                  <div className="mt-[40px] flex flex-col items-center pl-4">
                    <div className="flex items-center gap-[10px]">
                      <img src="/xki-logo.png" style={{ width: 30, height: 30 }} />
                      <p className="text-[34px] font-extrabold italic leading-[26px] text-white">
                        {prize ? `${convertMicroDenomToDenom(prize?.amount!)}` : 'XXXX'}
                      </p>
                    </div>
                    <p className="mt-[16px] text-[20px] font-semibold text-[#9FA4DD]">Prize pool</p>
                  </div>
                  <div className="mt-[40px] flex flex-1 flex-col items-center justify-center">
                    {nextLeagueStartDate ? (
                      <Countdown
                        from={new Date()}
                        to={nextLeagueStartDate}
                        className="text-[34px] font-extrabold italic leading-[30px] text-white"
                      />
                    ) : (
                      <p className="text-[34px] font-extrabold italic leading-[30px] text-white">
                        Coming soon
                      </p>
                    )}
                    <p className="mt-[16px] text-[20px] font-semibold text-[#9FA4DD]">
                      Championship starts in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </UnmaskOnReach>
        </div>
      </div>

      <ConnectionNeededContent>
        <div className="max-w-auto px-2 pt-[80px]">
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
            <div>
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
