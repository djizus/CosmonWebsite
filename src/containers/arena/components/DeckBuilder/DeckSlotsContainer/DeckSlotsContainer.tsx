import Alert from '@components/Alert/Alert'
import Button from '@components/Button/Button'
import { AFFINITY_TYPES, NFTId } from '@services/deck'
import { useDeckStore } from '@store/deckStore'
import { AnimatePresence } from 'framer-motion'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { CosmonType } from 'types/Cosmon'
import DeckAffinities from '../../DeckAffinities/DeckAffinities'
import { DeckBuilderContext } from '../DeckBuilderContext'
import DeckSlot from './DeckSlot'

interface DeckSlotsContainerProps {}

const DeckSlotsContainer: React.FC<DeckSlotsContainerProps> = ({}) => {
  const { deck, deckName, setDeck, setDeckName, handleCloseModal, deckToEdit } =
    useContext(DeckBuilderContext)

  const [errors, setErrors] = useState<string[]>([])

  const {
    createDeck,
    creatingDeck,
    updateDeck,
    updatingDeck,
    computeDeckAffinities,
  } = useDeckStore()
  const [highlightNftsWithAffinity, setHighlightNftsWithAffinity] = useState<
    string[] | undefined
  >()

  const handleClickSaveDeck = useCallback(async () => {
    try {
      if (checkDeckErrors(deck, deckName) === false) {
        return
      }

      if (deckToEdit === undefined) {
        await createDeck(
          deckName,
          deck.map((d) => d?.id!)
        )
      } else {
        await updateDeck(
          deckToEdit.id,
          deckName,
          deck.map((d) => d?.id!)
        )
      }

      handleCloseModal()
      setDeck([])
      setDeckName('')
    } catch (error) {
      console.error(error)
    }
  }, [deck, deckName, handleCloseModal, deckToEdit, errors])

  const checkDeckErrors = (
    deck: (CosmonType | undefined)[],
    deckName: string
  ) => {
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
    return deck?.filter((d) => d !== undefined).length > 1
      ? computeDeckAffinities(deck as CosmonType[])
      : undefined
  }, [deck])

  const handleHoverAffinity = useCallback(
    (affinityData: Set<NFTId>, affinity: AFFINITY_TYPES) => {
      const affinityDatas = Array.from(affinityData)
      setHighlightNftsWithAffinity(affinityDatas)
    },
    []
  )

  const handleStopHoverAffinity = useCallback(() => {
    setHighlightNftsWithAffinity(undefined)
  }, [])

  const computeIsDeckSlotHighlighted = useCallback(
    (cosmon: CosmonType) => {
      if (!highlightNftsWithAffinity) return
      const hasChildrenArray = Array.isArray(highlightNftsWithAffinity[0])
      if (!hasChildrenArray) {
        return cosmon && highlightNftsWithAffinity.includes(cosmon.id)
      }
      return highlightNftsWithAffinity.some(
        (arrayIds) => cosmon && arrayIds.includes(cosmon.id)
      )
    },
    [highlightNftsWithAffinity]
  )

  return (
    <div className="flex h-full w-full flex-col justify-around">
      <div />
      <div className="flex flex-col items-center">
        <div className="h-[40px]">
          {affinities ? (
            <DeckAffinities
              deckAffinities={affinities}
              variant="pills"
              onHoverAffinity={handleHoverAffinity}
              onStopHoverAffinity={handleStopHoverAffinity}
            />
          ) : null}
        </div>
        <div className="mt-[30px] flex gap-[40px]">
          {deck.map((deckSlot, i) => (
            <DeckSlot
              key={`deckSlot-${i}`}
              slotIdx={i}
              data={deckSlot}
              highlight={computeIsDeckSlotHighlighted(deckSlot!)}
            />
          ))}
        </div>

        <div className="mt-[54px] flex justify-center rounded-[16px] bg-cosmon-main-secondary py-[20px] px-[90px]">
          <p className="text-cosmon-main-tertiary">
            Choose the right equilibrium between your players
          </p>
        </div>
      </div>
      <div className="relative mb-[4em] flex flex-col items-center">
        <div
          className="absolute flex flex-col gap-[20px]"
          style={{ bottom: 'calc(100% + 34px)' }}
        >
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
    </div>
  )
}

export default DeckSlotsContainer
