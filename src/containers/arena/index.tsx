import Button from '@components/Button/Button'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import Countdown from '@components/Countdown/Countdown'
import Tooltip from '@components/Tooltip/Tooltip'
import { getMEAs } from '@containers/arena/data'
import { Coin } from '@cosmjs/proto-signing'
import { useArenaStore } from '@store/arenaStore'
import { useDeckStore } from '@store/deckStore'
import { useGameStore } from '@store/gameStore'
import { convertMicroDenomToDenom } from '@utils/conversion'
import clsx from 'clsx'
import isAfter from 'date-fns/isAfter'
import { AnimatePresence } from 'framer-motion'
import numeral from 'numeral'
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
  const { arenasList, fetchArenasList } = useGameStore()
  const {
    fetchNextPrizePool,
    fetchCurrentChampionshipNumber,
    currentChampionshipNumber,
    getNextLeagueOpenTime,
  } = useArenaStore()
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
        fetchLeagueProPrizePool(leaguePro.contract)
        fetchCurrentChampionshipNumber(leaguePro.contract)
        const startTimestamp = leaguePro.arena_open_time
        const startEpoch = new Date(0)
        startEpoch.setUTCSeconds(startTimestamp)
        if (isAfter(new Date(), startEpoch)) {
          setCurrentLeaguePro(leaguePro)
        }
        setNextLeagueStartDate(startEpoch)
      }
    } else {
      // we have to put this in a place (method) where the whole app bootstraps
      fetchArenasList()
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
            <MEA key={`mea-${i}`} {...mea} />
          ))}
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
                <h2 className="text-[34px] leading-[26px]">
                  Championship #{currentChampionshipNumber}
                </h2>
              </div>
              <div className="flex items-center ">
                <div className="mt-[40px] flex flex-col items-center pl-4">
                  <div className="flex items-center gap-[10px]">
                    <img src="/xki-logo.png" style={{ width: 30, height: 30 }} />
                    <p className="text-[34px] font-extrabold italic leading-[26px] text-white">
                      {prize
                        ? `${numeral(convertMicroDenomToDenom(prize?.amount!)).format('0,0')}`
                        : 'XXXX'}
                    </p>
                  </div>
                  <div className={style.tipContainer}>
                    <p
                      className={clsx(
                        'text-[20px] font-semibold text-[#9FA4DD]',
                        style.prizePoolText
                      )}
                    >
                      Prize pool
                    </p>
                    <img
                      src="/icons/info.svg"
                      alt="Prizepool info"
                      data-tip="Prizepool"
                      data-for={`prizepool`}
                      className="h-[24px] w-[24px] cursor-help"
                    />
                    <Tooltip
                      className={style.toolTip}
                      id={`prizepool`}
                      place="bottom"
                      offset={{
                        bottom: 8,
                      }}
                    >
                      <>
                        <p className={style.tipTitle}>Prize pool breakdown</p>
                        <div className={style.line}>
                          <p className={style.tipFirstText}>
                            1.<span className={style.tipPercent}>50%</span>
                          </p>
                          <p className={style.tipSecondText}>
                            2.<span className={style.tipPercent}>10%</span>
                          </p>
                          <p className={style.tipText}>
                            3.<span className={style.tipPercent}>5%</span>
                          </p>
                        </div>
                        <div className={style.line}>
                          <p className={style.tipFourthText}>
                            4.<span className={style.tipPercent}>3%</span>
                          </p>
                          <p className={style.tipFifthText}>
                            5.<span className={style.tipPercent}>2%</span>
                          </p>
                          <p className={style.tipText}>
                            6 - 200.<span className={style.tipPercent}>0.15%</span>
                          </p>
                        </div>
                      </>
                    </Tooltip>
                  </div>
                </div>
                <div className="mt-[40px] flex flex-1 flex-col items-center justify-center">
                  <Countdown
                    from={new Date()}
                    to={getNextLeagueOpenTime()}
                    className="text-[34px] font-extrabold italic leading-[30px] text-white"
                  />
                  <p className="mt-[16px] text-[20px] font-semibold text-[#9FA4DD]">
                    Championship starts in
                  </p>
                </div>
              </div>
            </div>
          </div>
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
