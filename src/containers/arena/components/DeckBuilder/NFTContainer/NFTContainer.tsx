import { CosmonType } from 'types/Cosmon'
import React, { useCallback, useContext, useMemo } from 'react'
import styles from './NFTContainer.module.scss'
import NFTName from './NFTName'
import Badge from '@components/Badge/Badge'
import { getCosmonStat, getScarcityByCosmon, getTrait } from '@utils/cosmon'
import { DeckBuilderContext } from '../DeckBuilderContext'
import NFTStats from './NFTStats'
import { AnimatePresence, motion } from 'framer-motion'
import { useDrag, DragPreviewImage } from 'react-dnd'
import Tooltip from '@components/Tooltip/Tooltip'
import { computeMalusForDeck, deckHasMalus, getCosmonPower } from '@utils/malus'
import { CosmonTypeWithMalus } from 'types/Malus'

interface NFTContainerProps {
  nft: CosmonType
  listIdx: number
}

const NFTContainer: React.FC<NFTContainerProps> = ({ nft, listIdx }) => {
  const { listFilter, deck, setDeck } = useContext(DeckBuilderContext)

  const [{ isDragging: _isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'COSMON',
      item: nft,
      canDrag: () => {
        return nft.isInDeck === false || nft.temporaryFree === true
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [nft]
  )

  const firstFreeSlotIdx = useMemo(() => {
    return deck.cosmons.findIndex((d) => d === undefined)
  }, [deck])

  // Add an NFT to a deck on double click
  const handleDoubleClick = useCallback(() => {
    if (
      firstFreeSlotIdx !== -1 &&
      (nft.isInDeck === false || nft.temporaryFree === true) &&
      deck.cosmons.findIndex((d) => d?.id === nft.id) === -1
    ) {
      let cosmonsTemp = [...deck.cosmons]

      cosmonsTemp[firstFreeSlotIdx] = {
        ...nft,
        malusPercent: 0,
        statsWithMalus: [...nft.stats],
        cosmonPower: getCosmonPower(nft.stats),
        cosmonPowerWithMalus: getCosmonPower(nft.stats),
      }

      const filtredCosmons = cosmonsTemp.filter(
        (item) => item !== undefined
      ) as CosmonTypeWithMalus[]

      const computedCosmons = computeMalusForDeck([...filtredCosmons])

      setDeck({
        ...deck,
        hasMalus: deckHasMalus(computedCosmons),
        cosmons: computedCosmons,
      })
    }
  }, [deck, nft, firstFreeSlotIdx])

  return (
    <motion.div
      initial={{
        x: '-100%',
        opacity: 0,
      }}
      animate={{
        x: '0',
        opacity: 1,
        transition: {
          delay: (listIdx * 200) / 5 / 1000,
          duration: 0,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          delay: 0,
          duration: 0,
        },
      }}
    >
      <DragPreviewImage connect={dragPreview} src={'/dragging-preview.png'} />
      <div
        className={styles.container}
        style={{
          ...(deck.cosmons.find((cosmon) => cosmon?.id === nft.id) ||
          (nft.isInDeck === true && !nft.temporaryFree)
            ? { opacity: 0.7 }
            : null),
          ...(nft.isInDeck === true && !nft.temporaryFree
            ? { background: 'rgba(159, 164, 221, 0.1)', cursor: 'pointer' }
            : null),
        }}
        ref={drag}
      >
        <div className="flex flex-1 justify-between" onDoubleClick={handleDoubleClick}>
          <div className="flex">
            <div>
              <img
                src={nft.data.extension.image}
                width={74}
                style={{ top: 12, position: 'relative' }}
              />
            </div>
            <div className="ml-[13px] flex flex-col items-start justify-center text-left">
              <NFTName name={nft.data.extension.name} />
              <div className="mt-[8px] flex flex-row gap-[8px]">
                <Badge variant="secondary">{getTrait(nft, 'Time')}</Badge>
                <Badge variant="secondary">{getTrait(nft, 'Personality')}</Badge>
              </div>
              <div className="mt-[8px] flex flex-row gap-[8px]">
                <p className="text-xs text-cosmon-main-secondary ">
                  {getTrait(nft, 'Geographical')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="m-1 flex">
              <img
                height="32px"
                width="32px"
                className="m-1"
                data-tip="tootlip"
                data-for={`${nft.id}-${getScarcityByCosmon(nft)}`}
                src={`/rarity-levels/${getScarcityByCosmon(nft)!.toLowerCase()}.png`}
              />
              <Tooltip
                id={`${nft.id}-${getScarcityByCosmon(nft)}`}
                place="left"
                offset={{ right: 13 }}
              >
                <p>{getScarcityByCosmon(nft)}</p>
              </Tooltip>
            </div>
            <div className="m-1 flex">
              <p className="text-sm font-semibold text-cosmon-main-secondary">
                Lvl.{' '}
                <span className="">{nft.stats && getCosmonStat(nft.stats, 'Level')?.value}</span>
              </p>
            </div>
          </div>
        </div>
        <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
          {listFilter.showStats ? <NFTStats nftStats={nft.stats} nftId={nft.id} /> : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default NFTContainer
