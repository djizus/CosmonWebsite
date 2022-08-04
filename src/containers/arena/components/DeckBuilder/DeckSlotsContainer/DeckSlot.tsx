import React, { useContext, useMemo } from 'react'
import { CosmonType } from 'types/Cosmon'
import { useDrop } from 'react-dnd'
import { DeckBuilderContext } from '../DeckBuilderContext'
import clsx from 'clsx'
import styles from './DeckSlot.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import TopLeftCorner from '@public/deck/top-left-corner.svg'
import Plus from '@public/icons/plus.svg'

interface DeckSlotProps {
  slotIdx: number
  data: CosmonType | undefined
  highlight?: boolean
}

const DeckSlot: React.FC<DeckSlotProps> = ({ data, slotIdx, highlight }) => {
  const { deck, setDeck } = useContext(DeckBuilderContext)

  const [collectedProps, drop] = useDrop(
    () => ({
      accept: 'COSMON',
      canDrop: (item: CosmonType) => {
        return (
          deck.findIndex((d) => d?.id === item.id) === -1 &&
          (deck[slotIdx] === undefined || deck[slotIdx]?.id !== item.id)
        )
      },
      drop: (item: CosmonType) => {
        let deckTemp = [...deck]
        deckTemp[slotIdx] = item
        setDeck(deckTemp as CosmonType[])
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [slotIdx, deck]
  )

  const firstFreeSlotIdx = useMemo(() => {
    return deck.findIndex((d) => d === undefined)
  }, [deck])

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
          {data !== undefined ? (
            <img src={data?.data.extension.image} className="h-full w-full" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Plus />
              <p className="mt-[13px] text-cosmon-main-tertiary">
                Player {slotIdx + 1}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeckSlot
