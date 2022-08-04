import { CosmonType } from 'types/Cosmon'
import React, { useContext } from 'react'
import styles from './NFTContainer.module.scss'
import NFTName from './NFTName'
import Badge from '@components/Badge/Badge'
import { getCosmonStat, getScarcityByCosmon, getTrait } from '@utils/cosmon'
import { DeckBuilderContext } from '../DeckBuilderContext'
import NFTStats from './NFTStats'
import { AnimatePresence, motion } from 'framer-motion'
import { useDrag, DragPreviewImage } from 'react-dnd'
import Tooltip from '@components/Tooltip/Tooltip'

interface NFTContainerProps {
  nft: CosmonType
  listIdx: number
}

const NFTContainer: React.FC<NFTContainerProps> = ({ nft, listIdx }) => {
  const { listFilter, deck } = useContext(DeckBuilderContext)

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      // "type" is required. It is used by the "accept" specification of drop targets.
      type: 'COSMON',
      item: nft,
      canDrag: () => {
        return nft.isInDeck === false
      },
      // The collect function utilizes a "monitor" instance (see the Overview for what this is)
      // to pull important pieces of state from the DnD system.
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [nft]
  )

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
      <DragPreviewImage connect={dragPreview} src={nft.data.extension.image} />
      <div
        className={styles.container}
        style={{
          ...(deck.includes(nft) || nft.isInDeck === true
            ? { opacity: 0.7 }
            : null),
          ...(nft.isInDeck === true
            ? { background: 'rgba(159, 164, 221, 0.1)', cursor: 'pointer' }
            : null),
        }}
        ref={drag}
      >
        <div className="flex flex-1 justify-between">
          <div className="felx-col flex">
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
                <Badge>{getTrait(nft, 'Time')}</Badge>
                <Badge>{getTrait(nft, 'Personality')}</Badge>
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
                src={`/rarity-levels/${getScarcityByCosmon(
                  nft
                )!.toLowerCase()}.png`}
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
                <span className="">
                  {nft.stats && getCosmonStat(nft.stats, 'Level')?.value}
                </span>
              </p>
            </div>
          </div>
        </div>
        <AnimatePresence
          initial={false}
          exitBeforeEnter={true}
          onExitComplete={() => null}
        >
          {listFilter.showStats ? (
            <NFTStats nftStats={nft.stats} nftId={nft.id} />
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default NFTContainer