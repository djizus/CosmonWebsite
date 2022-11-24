import React, { useCallback, useContext, useMemo } from 'react'
import { CosmonType } from 'types/Cosmon'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { DeckBuilderContext } from '../DeckBuilderContext'
import clsx from 'clsx'
import styles from './DeckSlot.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import TopLeftCorner from '@public/deck/top-left-corner.svg'
import TopLeftCornerMalus from '@public/deck/top-left-corner-malus.svg'
import Plus from '@public/icons/plus.svg'
import { useWalletStore } from '@store/walletStore'
import FlipCard from '@components/FlipCard/FlipCard'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import CosmonStatsCard from '@components/Cosmon/CosmonCard/CosmonStatsCard'
import { computeMalusForDeck, deckHasMalus } from '@utils/malus'
import { CosmonTypeWithMalus } from 'types/Malus'

interface DeckSlotProps {
  slotIdx: number
  data: CosmonType | undefined
  highlight?: boolean
  revealStats?: boolean
  isAffinityHighlightMalus?: boolean
}

const DeckSlot: React.FC<DeckSlotProps> = ({
  data,
  slotIdx,
  highlight,
  revealStats = false,
  isAffinityHighlightMalus,
}) => {
  const { deck, setDeck, deckToEdit } = useContext(DeckBuilderContext)
  const { markCosmonAsTemporaryFree } = useWalletStore()

  const [_collectedProps, drop] = useDrop(
    () => ({
      accept: ['COSMON', 'SWAPPING_COSMON'],
      canDrop: (item: CosmonType) => {
        return deck?.cosmons[slotIdx] === undefined || deck?.cosmons[slotIdx]?.id !== item.id
      },
      drop: (item: CosmonType) => {
        let cosmonsTemp = [...deck.cosmons]
        // If already in deck => swap
        if (deck && deck.cosmons.findIndex((d) => d?.id === item.id) !== -1) {
          cosmonsTemp[deck.cosmons.findIndex((d) => d?.id === item.id)] = deck.cosmons[slotIdx]
        } else {
          // If we replace a cosmon by a new one, we mark the one we replaced as temporary free
          if (deckToEdit && deck?.cosmons[slotIdx] !== undefined) {
            markCosmonAsTemporaryFree(deck.cosmons[slotIdx]?.id!)
          }
        }

        const filtredCosmons = cosmonsTemp.filter(
          (item) => item !== undefined
        ) as CosmonTypeWithMalus[]

        const computedCosmons = computeMalusForDeck([...filtredCosmons, item])

        setDeck({
          ...deck,
          hasMalus: deckHasMalus(computedCosmons),
          cosmons: computedCosmons,
        })
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [slotIdx, deck, data, deckToEdit]
  )

  const [{ isDragging: _isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'SWAPPING_COSMON',
      item: data,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [data]
  )

  const firstFreeSlotIdx = useMemo(() => {
    return deck.cosmons.findIndex((d) => d === undefined)
  }, [deck])

  const handleRemoveNftFromDeck = useCallback(() => {
    let cosmonsTemp = [...deck.cosmons]

    if (deckToEdit) {
      markCosmonAsTemporaryFree(cosmonsTemp[slotIdx]?.id!)
    }

    cosmonsTemp[slotIdx] = undefined

    const filtredCosmons = cosmonsTemp.filter((item) => item !== undefined) as CosmonTypeWithMalus[]

    const computedCosmons = computeMalusForDeck([...filtredCosmons])

    setDeck({
      ...deck,
      hasMalus: deckHasMalus(computedCosmons),
      cosmons: computedCosmons,
    })
  }, [deck, slotIdx, deckToEdit])

  return (
    <div className={styles.deckSlotWrapper}>
      <AnimatePresence>
        {firstFreeSlotIdx === slotIdx || highlight ? (
          <div className={styles.deckSlotCorners}>
            <div className="flex h-full w-full flex-col justify-between">
              {isAffinityHighlightMalus && data ? (
                <>
                  <div className="flex flex-row justify-between">
                    <TopLeftCornerMalus />
                    <TopLeftCornerMalus style={{ transform: 'rotate(90deg)' }} />
                  </div>
                  <div className="flex flex-row justify-between">
                    <TopLeftCornerMalus style={{ transform: 'rotate(270deg)' }} />
                    <TopLeftCornerMalus style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-row justify-between">
                    <TopLeftCorner />
                    <TopLeftCorner style={{ transform: 'rotate(90deg)' }} />
                  </div>
                  <div className="flex flex-row justify-between">
                    <TopLeftCorner style={{ transform: 'rotate(270deg)' }} />
                    <TopLeftCorner style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </AnimatePresence>

      <div ref={drop} className={clsx(styles.deckSlotContainer)}>
        <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-cosmon-main-secondary">
          <AnimatePresence>
            {data !== undefined ? (
              <motion.div
                initial={{ transform: 'scale(0)' }}
                animate={{ transform: 'scale(1)' }}
                exit={{ transform: 'scale(0)' }}
                className="h-full w-full"
              >
                <div className="group h-full w-full transition-all">
                  <DragPreviewImage connect={dragPreview} src={'/dragging-preview.png'} />
                  <div
                    onClick={handleRemoveNftFromDeck}
                    className="transfer-card-icon absolute -top-4 -right-4 z-30 scale-0 cursor-pointer rounded-full p-2 transition-all group-hover:scale-100"
                  >
                    <img
                      width="16px"
                      height="16px"
                      src="../icons/trash.svg"
                      alt="Remove cosmon from deck"
                    />
                  </div>
                  <div ref={drag} className="h-full w-full">
                    <FlipCard
                      card={
                        <CosmonCard
                          cosmon={data}
                          showLevel
                          showPersonality
                          showNationality
                          showScarcity
                          imgStyle={{ objectFit: 'cover', borderRadius: 6 }}
                        />
                      }
                      cardBack={<CosmonStatsCard cosmon={data} />}
                      revealed={revealStats}
                      className="h-full w-full cursor-grab"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Plus />
                <p className="mt-[13px] text-cosmon-main-tertiary">Player {slotIdx + 1}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default DeckSlot
