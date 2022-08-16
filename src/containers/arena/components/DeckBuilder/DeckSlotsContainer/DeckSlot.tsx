import React, { useCallback, useContext, useMemo } from 'react'
import { CosmonType } from 'types/Cosmon'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { DeckBuilderContext } from '../DeckBuilderContext'
import clsx from 'clsx'
import styles from './DeckSlot.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import TopLeftCorner from '@public/deck/top-left-corner.svg'
import Plus from '@public/icons/plus.svg'
import { useWalletStore } from '@store/walletStore'

interface DeckSlotProps {
  slotIdx: number
  data: CosmonType | undefined
  highlight?: boolean
}

const DeckSlot: React.FC<DeckSlotProps> = ({ data, slotIdx, highlight }) => {
  const { deck, setDeck, deckToEdit } = useContext(DeckBuilderContext)
  const { markCosmonAsTemporaryFree } = useWalletStore()

  const [collectedProps, drop] = useDrop(
    () => ({
      accept: ['COSMON', 'SWAPPING_COSMON'],
      canDrop: (item: CosmonType) => {
        return deck[slotIdx] === undefined || deck[slotIdx]?.id !== item.id
      },
      drop: (item: CosmonType) => {
        let deckTemp = [...deck]
        // If already in deck => swap
        if (deck.findIndex((d) => d?.id === item.id) !== -1) {
          deckTemp[deck.findIndex((d) => d?.id === item.id)] = deck[slotIdx]
        } else {
          // If we replace a cosmon by a new one, we mark the one we replaced as temporary free
          if (deckToEdit && deck[slotIdx] !== undefined) {
            markCosmonAsTemporaryFree(deck[slotIdx]?.id!)
          }
        }
        deckTemp[slotIdx] = item
        setDeck(deckTemp as CosmonType[])
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [slotIdx, deck, data, deckToEdit]
  )

  const [{ isDragging }, drag, dragPreview] = useDrag(
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
    return deck.findIndex((d) => d === undefined)
  }, [deck])

  const handleRemoveNftFromDeck = useCallback(() => {
    let deckTemp = [...deck]
    if (deckToEdit) {
      markCosmonAsTemporaryFree(deckTemp[slotIdx]?.id!)
    }
    deckTemp[slotIdx] = undefined
    setDeck(deckTemp as CosmonType[])
  }, [deck, slotIdx, deckToEdit])

  return (
    <div className={styles.deckSlotWrapper}>
      <AnimatePresence>
        {firstFreeSlotIdx === slotIdx || highlight ? (
          <div className={styles.deckSlotCorners}>
            <div className="flex h-full w-full flex-col justify-between">
              <div className="flex flex-row justify-between">
                <TopLeftCorner />
                <TopLeftCorner style={{ transform: 'rotate(90deg)' }} />
              </div>
              <div className="flex flex-row justify-between">
                <TopLeftCorner style={{ transform: 'rotate(270deg)' }} />
                <TopLeftCorner style={{ transform: 'rotate(180deg)' }} />
              </div>
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
                className="h-full"
              >
                <div className="group h-full transition-all">
                  <DragPreviewImage
                    connect={dragPreview}
                    src={'/dragging-preview.png'}
                  />
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
                  <img
                    ref={drag}
                    src={data?.data.extension.image}
                    className="h-full w-full cursor-grab"
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Plus />
                <p className="mt-[13px] text-cosmon-main-tertiary">
                  Player {slotIdx + 1}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default DeckSlot
