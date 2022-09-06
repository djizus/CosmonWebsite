import { useDeckStore } from '@store/deckStore'
import { useGameStore } from '@store/gameStore'
import { useWalletStore } from '@store/walletStore'
import { getCosmonStat } from '@utils/cosmon'
import { AnimatePresence } from 'framer-motion'
import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { CosmonType, Deck, FightType } from 'types'
import { ArenaType } from 'types/Arena'
import { FightContext } from '../FightContext'
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

  const [battle, setBattle] = useState<FightType | undefined>()
  const [battleOverTime, setBattleOverTime] = useState<FightType | undefined>()

  const [finalBattle, setFinalBattle] = useState<FightType>() // @deprecated
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
      if (selectedDeck) {
        console.log('cosmons are updated and so the selected deck')
        updateCosmonsInSelectedDeck(selectedDeck, cosmons)
      }
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
          const newBattle = await fight(selectedDeck, arena)
          setBattle({ ...newBattle })
          setBattleOverTime({ ...newBattle })
          setShowSelectArenaModal(false)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [selectedDeck]
  )

  const updateCosmonsInSelectedDeck = (deck: Deck, cosmons: CosmonType[]) => {
    const updatedCosmons = cosmons
      .map((c) => deck.cosmons.findIndex((dc) => dc.id === c.id) !== -1 && c)
      .filter(Boolean)
    setSelectedDeck((prevState) => ({ ...prevState, cosmons: updatedCosmons } as Deck))
  }

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

  const handleClickNewFight = async () => {
    try {
      if (
        selectedDeck &&
        selectedArena &&
        selectedDeck.cosmons.some((c) => +getCosmonStat(c.stats!, 'Fp')?.value! === 0) === false
      ) {
        const newBattle = await fight(selectedDeck, selectedArena)
        setBattle(undefined)
        setBattleOverTime(undefined)
        setBattle({ ...newBattle })
        setBattleOverTime({ ...newBattle })
        setShowFightReportModal(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseFightModal = () => {
    setBattle(undefined)
    setSelectedArena(undefined)
    setShowFightReportModal(false)
  }

  const handleCloseFightReportModal = () => {
    setBattle(undefined)
    setSelectedArena(undefined)
    setShowFightReportModal(false)
  }

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

      <FightContext.Provider
        value={{
          battle,
          setBattle,
          battleOverTime,
          setBattleOverTime,
          handleClickNewFight,
          handleCloseFightModal,
          handleCloseFightReportModal,
        }}
      >
        <AnimatePresence>
          {battle && battleOverTime ? (
            <FightModal
              key={`${[...battle.me.cosmons.map((c) => c.id)]}_vs_${[
                ...battle.opponent.cosmons.map((c) => c.id),
              ]}`}
              onFightEnd={handleFightEnd}
              onCloseModal={handleCloseFightModal}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showFightReportModal && battle && finalBattle ? (
            <FightReportModal
              battle={battle}
              finalBattle={finalBattle}
              onClickNewFight={handleClickNewFight}
              onCloseModal={handleCloseFightReportModal}
            />
          ) : null}
        </AnimatePresence>
      </FightContext.Provider>
    </div>
  )
}

export default Decks
