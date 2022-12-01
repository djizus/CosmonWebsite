import Alert from '@components/Alert/Alert'
import Button from '@components/Button/Button'
import { AFFINITY_TYPES, NFTId, CosmonType } from 'types'
import { useDeckStore } from '@store/deckStore'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import DeckAffinities from '../../DeckAffinities/DeckAffinities'
import { DeckBuilderContext } from '../DeckBuilderContext'
import DeckSlot from './DeckSlot'
import FlipIcon from '@public/icons/flip.svg'
import { CosmonTypeWithMalus } from 'types/Malus'
import MalusInfoModal from '../../MalusInfoModal/MalusInfoModal'

interface DeckSlotsContainerProps {}

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const DeckSlotsContainer: React.FC<DeckSlotsContainerProps> = ({}) => {
  const { deck, setDeck, handleCloseModal, deckToEdit } = useContext(DeckBuilderContext)

  const [errors, setErrors] = useState<string[]>([])
  const [revealStats, setRevealStats] = useState(true)
  const [isAffinityHighlightMalus, setIsAffinityHighlightMalus] = useState(false)

  const { createDeck, creatingDeck, updateDeck, updatingDeck, computeDeckAffinities } =
    useDeckStore()
  const [highlightNftsWithAffinity, setHighlightNftsWithAffinity] = useState<string[] | undefined>()

  const handleClickSaveDeck = useCallback(async () => {
    try {
      if (checkDeckErrors(deck.cosmons, deck.name) === false) {
        return
      }

      if (deckToEdit === undefined) {
        await createDeck(
          deck.name,
          deck.cosmons.map((d) => d?.id!)
        )
      } else {
        await updateDeck(
          deckToEdit.id,
          deck.name,
          deck.cosmons.map((d) => d?.id!)
        )
      }

      handleCloseModal()
      setDeck({
        id: -1,
        name: '',
        cosmons: [],
        hasMalus: false,
      })
    } catch (error) {
      console.error(error)
    }
  }, [deck, handleCloseModal, deckToEdit, errors])

  const checkDeckErrors = (deck: (CosmonType | undefined)[], deckName: string) => {
    let es = []
    if (!deckName || deckName === '') {
      es.push('Please choose your team name before saving')
    }
    if (!deck || deck.findIndex((d) => d === undefined) !== -1) {
      es.push('Please add 3 Cosmons to your deck before saving')
    }
    setErrors(es)
    return es.length > 0 ? false : true
  }

  const affinities = useMemo(() => {
    const filtredCosmons = deck.cosmons.filter(
      (item) => item !== undefined
    ) as CosmonTypeWithMalus[]

    return filtredCosmons.length > 1 ? computeDeckAffinities(filtredCosmons) : undefined
  }, [deck])

  const handleHoverAffinity = useCallback((affinityData: Set<NFTId>, affinity: AFFINITY_TYPES) => {
    const affinityDatas = Array.from(affinityData)

    if (affinity === AFFINITY_TYPES.MALUS) {
      setIsAffinityHighlightMalus(true)
    } else {
      setIsAffinityHighlightMalus(false)
    }

    setHighlightNftsWithAffinity(affinityDatas)
  }, [])

  const handleStopHoverAffinity = useCallback(() => {
    setHighlightNftsWithAffinity(undefined)
    setIsAffinityHighlightMalus(false)
  }, [])

  const computeIsDeckSlotHighlighted = useCallback(
    (cosmon: CosmonType) => {
      if (!highlightNftsWithAffinity) return
      const hasChildrenArray = Array.isArray(highlightNftsWithAffinity[0])
      if (!hasChildrenArray) {
        return cosmon && highlightNftsWithAffinity.includes(cosmon.id)
      }
      return highlightNftsWithAffinity.some((arrayIds) => cosmon && arrayIds.includes(cosmon.id))
    },
    [highlightNftsWithAffinity]
  )

  const handleClickFlipCards = useCallback(() => {
    setRevealStats((prev) => !prev)
  }, [])

  const cosmonsWithMalus = useMemo(() => {
    return deck.cosmons.filter(
      (cosmon) => cosmon && cosmon.malusPercent > 0
    ) as CosmonTypeWithMalus[]
  }, [deck.cosmons])

  return (
    <div className="relative flex h-full w-full flex-col justify-around">
      <div className="flex flex-col items-center">
        <div className="h-[40px]">
          {affinities && deck ? (
            <DeckAffinities
              cosmons={
                deck.cosmons.filter((cosmon) => cosmon !== undefined) as CosmonTypeWithMalus[]
              }
              deckAffinities={affinities}
              variant="pills"
              onHoverAffinity={handleHoverAffinity}
              onStopHoverAffinity={handleStopHoverAffinity}
            />
          ) : null}
        </div>
        <div className="mt-[30px] flex gap-[40px]">
          {deck.cosmons.map((deckSlot, i) => (
            <DeckSlot
              key={`deckSlot-${i}`}
              slotIdx={i}
              data={deckSlot}
              highlight={computeIsDeckSlotHighlighted(deckSlot!)}
              isAffinityHighlightMalus={isAffinityHighlightMalus}
              revealStats={revealStats}
            />
          ))}
        </div>

        <div className="mt-[54px] flex justify-center rounded-[16px] bg-cosmon-main-secondary py-[20px] px-[90px]">
          <p className="text-cosmon-main-tertiary">
            Choose the right equilibrium between your players
          </p>
        </div>
        <div className="mt-[24px]">
          <Button
            type="primaryBordered"
            size="small"
            active={!revealStats}
            onClick={handleClickFlipCards}
            disabled={deck.cosmons.every((c) => c === undefined)}
          >
            <FlipIcon />
            <p>Flip</p>
          </Button>
        </div>
      </div>
      <div className="relative mb-[4em] flex flex-col items-center">
        <div className="absolute flex flex-col gap-[20px]" style={{ bottom: 'calc(100% + 34px)' }}>
          <AnimatePresence>
            {errors?.length > 0
              ? errors.map((error, i) => (
                  <Alert
                    key={i}
                    onHide={() => {
                      setErrors([])
                    }}
                  >
                    {error}
                  </Alert>
                ))
              : null}
          </AnimatePresence>
        </div>
        <Button
          type="primary"
          size="small"
          onClick={handleClickSaveDeck}
          isLoading={creatingDeck || updatingDeck}
        >
          Save my deck
        </Button>
      </div>
      {isAffinityHighlightMalus && cosmonsWithMalus ? (
        <MalusInfoModal cosmonsWithMalus={cosmonsWithMalus} />
      ) : null}
    </div>
  )
}

export default DeckSlotsContainer
