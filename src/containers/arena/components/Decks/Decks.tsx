import { useDeckStore } from '@store/deckStore'
import { useGameStore } from '@store/gameStore'
import { useWalletStore } from '@store/walletStore'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { Deck, FightType } from 'types'
import { ArenaType } from 'types/Arena'
import FightModal from '../FightModal/FightModal'
import FightReportModal from '../FightReportModal/FightReportModal'
import SelectArenaModal from '../SelectArenaModal'
import TrainingModeDescriptionModal from '../TrainingModeDescriptionModal'
import DeckContainer from './DeckContainer/DeckContainer'
import DecksEmptyList from './DecksEmptyList'

interface DecksProps {
  onEditDeck: (deck: Deck) => void
  onDeleteDeck: (deck: Deck) => void
}

const Decks: React.FC<DecksProps> = ({ onEditDeck, onDeleteDeck }) => {
  const { isConnected, cosmons } = useWalletStore()
  const { fetchArenasList, registerToArena, fight } = useGameStore()
  const { decksList, fetchDecksList, fetchPersonalityAffinities, refreshCosmonsAndDecksList } =
    useDeckStore()

  const [showSelectArenaModal, setShowSelectArenaModal] = useState(false)
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false)
  const [showFightReportModal, setShowFightReportModal] = useState(false)
  const [battle, setBattle] = useState<FightType>()
  const [finalBattle, setFinalBattle] = useState<FightType>()
  const [selectedArena, setSelectedArena] = useState<ArenaType>()
  const [selectedDeck, setSelectedDeck] = useState<Deck>()

  useEffect(() => {
    if (isConnected) {
      fetchPersonalityAffinities()
      fetchArenasList()
    }
  }, [isConnected])

  useEffect(() => {
    if (cosmons && cosmons.length) {
      fetchDecksList()
    }
  }, [cosmons])

  const handleLaunchFight = useCallback(
    async (arena: ArenaType) => {
      setSelectedArena(arena)
      if (arena.registeredIn === false) {
        setShowSelectArenaModal(false)
        setShowLearnMoreModal(true)
        return
      }
      try {
        if (selectedDeck) {
          setBattle(await fight(selectedDeck, arena))
          setShowSelectArenaModal(false)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [selectedDeck]
  )

  useEffect(() => {
    if (battle) {
      console.log('🚀 ~ file: Decks.tsx ~ line 66 ~ useEffect ~ battle', battle)
    }
  }, [battle])

  const handleRegisterToArena = useCallback(async () => {
    try {
      if (selectedArena) {
        const refreshedArenasList = await registerToArena(selectedArena)
        setSelectedArena(refreshedArenasList?.find((arena) => arena.name === selectedArena.name))
        setShowLearnMoreModal(false)
        setShowSelectArenaModal(true)
      }
    } catch (error) {
      console.error(error)
    }
  }, [selectedArena])

  const handleClickFight = useCallback((deck: Deck) => {
    setSelectedDeck(deck)
    setShowSelectArenaModal(true)
  }, [])

  const handleFightEnd = useCallback(async (finalBattleState?: FightType) => {
    await refreshCosmonsAndDecksList()
    if (finalBattleState) {
      setFinalBattle(finalBattleState)
    }
    setShowFightReportModal(true)
  }, [])

  return (
    <div className="min-h-[400px]">
      {decksList?.length > 0 ? (
        <div className="mt-[40px]">
          <div className="grid w-full grid-cols-2 gap-[32px] overflow-visible">
            <AnimatePresence>
              {decksList.map((deck) => (
                <DeckContainer
                  key={`deck-${deck.id}`}
                  deck={deck}
                  onEditDeck={onEditDeck}
                  onClickDelete={onDeleteDeck}
                  onClickFight={handleClickFight}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <DecksEmptyList />
      )}
      {/* Modals */}
      <AnimatePresence>
        {showSelectArenaModal ? (
          <SelectArenaModal
            loading={false}
            selectedArena={selectedArena}
            onSelectArena={handleLaunchFight}
            onCloseModal={() => {
              setShowSelectArenaModal(false)
              setSelectedArena(undefined)
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showLearnMoreModal && new RegExp(/training/, 'ig').test(selectedArena?.name || '') ? (
          <TrainingModeDescriptionModal
            onCloseModal={() => {
              setSelectedArena(undefined)
            }}
            onSliderEndReached={handleRegisterToArena}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {battle ? (
          <FightModal
            battle={battle}
            onFightEnd={handleFightEnd}
            onCloseModal={() => {
              setSelectedArena(undefined)
              setBattle(undefined)
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showFightReportModal && battle && finalBattle ? (
          <FightReportModal
            battle={battle}
            finalBattle={finalBattle}
            onCloseModal={() => {
              setShowFightReportModal(false)
              setBattle(undefined)
              setSelectedArena(undefined)
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default Decks
