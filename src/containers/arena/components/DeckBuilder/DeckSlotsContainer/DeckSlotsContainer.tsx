import Button from '@components/Button/Button'
import { AFFINITY_TYPES, NFTId } from '@services/deck'
import { useDeckStore } from '@store/deckStore'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { CosmonType } from 'types/Cosmon'
import DeckAffinities from '../../DeckAffinities/DeckAffinities'
import { DeckBuilderContext } from '../DeckBuilderContext'
import DeckSlot from './DeckSlot'

interface DeckSlotsContainerProps {}

const DeckSlotsContainer: React.FC<DeckSlotsContainerProps> = ({}) => {
  const { deck, deckName, setDeck, setDeckName, handleCloseModal, deckToEdit } =
    useContext(DeckBuilderContext)
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
  }, [deck, deckName, handleCloseModal, deckToEdit])

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
      <div className="mb-[4em] flex justify-center">
        <Button
          type="primary"
          size="small"
          disabled={deck.some((v) => v === undefined) || deckName === ''}
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
