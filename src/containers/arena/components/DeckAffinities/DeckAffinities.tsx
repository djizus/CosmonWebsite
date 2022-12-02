import { AFFINITY_TYPES, Deck, DeckAffinitiesType, NFTId } from 'types'
import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Geographical from '@public/icons/geographical.svg'
import Warning from '@public/icons/warning.svg'
import Time from '@public/icons/time.svg'
import Personality from '@public/icons/personality.svg'
import Hexagon, { HexagonProps } from '@components/Hexagon/Hexagon'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './DeckAffinities.module.scss'
import { CosmonTypeWithMalus } from 'types/Malus'
import {
  computeCosmonMalusPercentForDeck,
  getAffinitiesWithoutMalus,
  getMalusInAffinities,
  getOnlyCosmonsWithMalus,
} from '@utils/malus'
import MalusInfoModal from '../MalusInfoModal/MalusInfoModal'

export type BadgeOptions = HexagonProps

interface DeckAffinitiesProps {
  cosmons: CosmonTypeWithMalus[]
  deckAffinities: DeckAffinitiesType
  variant: 'pills' | 'short' | 'badge'
  direction?: 'row' | 'column'
  containerStyle?: CSSProperties
  options?: BadgeOptions
  labelPosition?: 'left' | 'right' // labelPosition left => opponent side || my side
  onHoverAffinity?: (affinityData: Set<NFTId>, affinity: AFFINITY_TYPES) => void
  onStopHoverAffinity?: () => void
}

const DeckAffinities: React.FC<DeckAffinitiesProps> = ({
  cosmons,
  deckAffinities,
  variant,
  direction = 'row',
  labelPosition = 'right',
  options,
  containerStyle,
  onHoverAffinity,
  onStopHoverAffinity,
}) => {
  const [showBonusTooltip, setShowBonusTooltip] = useState<AFFINITY_TYPES>()
  const [displayMalusInfoModal, setDisplayMalusInfoModal] = useState(false)

  const renderAffinityIcon = useCallback((affinity: AFFINITY_TYPES, size = 17) => {
    switch (affinity) {
      case AFFINITY_TYPES.GEOGRAPHICAL:
        return <Geographical style={{ width: size, height: size }} />
      case AFFINITY_TYPES.PERSONALITY:
        return <Personality style={{ width: size, height: size }} />
      case AFFINITY_TYPES.TIME:
        return <Time style={{ width: size, height: size }} />
      case AFFINITY_TYPES.MALUS:
        return (
          <Warning
            style={{
              width: size + 1,
              height: size,
              color: variant === 'badge' ? '#DF4547' : 'white',
            }}
          />
        )
    }
  }, [])

  useEffect(() => {
    if (showBonusTooltip) {
      if (onHoverAffinity) {
        onHoverAffinity(
          deckAffinities[showBonusTooltip as AFFINITY_TYPES] as Set<string>,
          showBonusTooltip as AFFINITY_TYPES
        )
      }
    } else {
      if (onStopHoverAffinity) {
        onStopHoverAffinity()
      }
    }
  }, [showBonusTooltip])

  const getAffinityBonusSentence = (affinity: AFFINITY_TYPES, nbAffinities: number) => {
    switch (affinity) {
      case AFFINITY_TYPES.GEOGRAPHICAL:
        return `Cosmon have +${
          nbAffinities === 2 ? '10' : nbAffinities === 3 ? '20' : ''
        }% HP bonus`
      case AFFINITY_TYPES.TIME:
        return `Cosmon have +${nbAffinities === 2 ? '1' : nbAffinities === 3 ? '2' : ''} AP bonus`
      case AFFINITY_TYPES.PERSONALITY:
        return `+10% bonus on all fighting abilities`
      case AFFINITY_TYPES.MALUS:
        return `Cosmon have an average malus of ${computeCosmonMalusPercentForDeck(cosmons)}%`
    }
  }

  const renderPills = useMemo(() => {
    return (
      <div className="flex items-center" style={containerStyle}>
        <div className="flex gap-[8px]">
          {Object.keys(deckAffinities).map((affinity, i) =>
            (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size > 0 ? (
              <div
                className={clsx(
                  'flex cursor-help items-center rounded-xl bg-cosmon-main-quinary px-[11px] py-[8px]',
                  {
                    [styles.malusPills]: affinity === AFFINITY_TYPES.MALUS,
                  }
                )}
                key={affinity + '-' + i}
                onMouseEnter={() => {
                  if (onHoverAffinity) {
                    onHoverAffinity(
                      deckAffinities[affinity as AFFINITY_TYPES] as Set<string>,
                      affinity as AFFINITY_TYPES
                    )
                  }
                }}
                onMouseLeave={() => {
                  if (onStopHoverAffinity) {
                    onStopHoverAffinity()
                  }
                }}
              >
                {affinity === AFFINITY_TYPES.MALUS ? (
                  <p className="font-semibold text-white">
                    {computeCosmonMalusPercentForDeck(cosmons)}% in all stats
                  </p>
                ) : (
                  <p className="font-semibold text-white">
                    +{(deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size}
                  </p>
                )}
                &nbsp;
                {affinity !== AFFINITY_TYPES.MALUS ? (
                  <p className="font-semibold text-[#B1A8B9]">{affinity}</p>
                ) : null}
                &nbsp;
                {renderAffinityIcon(affinity as AFFINITY_TYPES)}
              </div>
            ) : null
          )}
        </div>
      </div>
    )
  }, [deckAffinities, cosmons])

  const renderShort = useMemo(() => {
    const affinitiesWithoutMalus = getAffinitiesWithoutMalus(deckAffinities)
    const malusAffinity = getMalusInAffinities(deckAffinities)

    return (
      <div className="flex items-center" style={containerStyle}>
        <div className="flex rounded-[8px] bg-cosmon-main-quinary px-[10px] py-[12px] ">
          {affinitiesWithoutMalus
            .map((affinity, i) => (
              <div key={affinity + '-' + i} className="flex items-center">
                {renderAffinityIcon(affinity as AFFINITY_TYPES)}
                <p className="ml-[5px] text-sm font-semibold text-white">
                  +{(deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size}
                </p>
              </div>
            ))
            .reduce(
              (prev, curr, i) =>
                [
                  prev,
                  <div
                    key={'sep-' + curr + '-' + i}
                    className="mx-[9px] w-[0.5px] bg-cosmon-main-tertiary opacity-50"
                  />,
                  curr,
                ] as any
            )}
        </div>
        {malusAffinity.map((affinity, i) => {
          if ((deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size > 0) {
            return (
              <div key={affinity + '-' + i}>
                <div
                  onMouseEnter={() => setDisplayMalusInfoModal(true)}
                  onMouseLeave={() => setDisplayMalusInfoModal(false)}
                  className={styles.malusShort}
                >
                  {renderAffinityIcon(affinity as AFFINITY_TYPES)}
                </div>
                {displayMalusInfoModal ? (
                  <MalusInfoModal
                    className={styles.malusInfoModal}
                    cosmonsWithMalus={getOnlyCosmonsWithMalus(cosmons)}
                  />
                ) : null}
              </div>
            )
          }
        })}
      </div>
    )
  }, [displayMalusInfoModal, deckAffinities, cosmons])

  const renderBadge = useMemo(() => {
    const affinitesWithoutMalus = getAffinitiesWithoutMalus(deckAffinities)
    const malusAffinity = getMalusInAffinities(deckAffinities)
    const getAffinities = () => {
      const result = affinitesWithoutMalus

      if ((deckAffinities[malusAffinity[0] as AFFINITY_TYPES] as Set<string>).size > 0) {
        return [...result, ...malusAffinity]
      }

      return result
    }

    return (
      <div
        className={clsx(`absolute flex gap-[12px]`, { 'flex-col': direction === 'column' })}
        style={containerStyle}
      >
        {getAffinities().map((affinity, i) => {
          return (
            <div
              key={affinity + '-' + i}
              className={`relative flex items-center justify-${
                labelPosition === 'left' ? 'end' : 'start'
              }`}
            >
              {showBonusTooltip !== affinity &&
              labelPosition === 'left' &&
              (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size > 0 ? (
                <p
                  className="py-[6px] px-[8px] text-sm font-semibold text-white"
                  style={{
                    background: 'transparent',
                    border: '1px solid #4E4888',
                    borderRight: 0,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                >
                  {affinity === AFFINITY_TYPES.MALUS
                    ? `${computeCosmonMalusPercentForDeck(cosmons)}%`
                    : `+${(deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size}`}
                </p>
              ) : null}
              <div
                style={{
                  cursor:
                    (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size > 0
                      ? 'help'
                      : 'auto',
                  position: 'relative',
                }}
                onMouseEnter={() => {
                  setShowBonusTooltip(affinity as AFFINITY_TYPES)
                }}
                onMouseLeave={() => {
                  setShowBonusTooltip(undefined)
                }}
              >
                <Hexagon
                  className={clsx({
                    [styles.redHexagon]: affinity === AFFINITY_TYPES.MALUS,
                  })}
                  width={59}
                  height={67}
                  {...options}
                >
                  <div
                    style={{
                      opacity:
                        (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size > 0
                          ? 1
                          : 0.4,
                    }}
                  >
                    {renderAffinityIcon(affinity as AFFINITY_TYPES, 28)}
                  </div>
                </Hexagon>
                <AnimatePresence>
                  {showBonusTooltip === affinity &&
                  (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, x: labelPosition === 'right' ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: labelPosition === 'right' ? -10 : 10 }}
                      transition={{ type: 'tween' }}
                      className={clsx(styles.affinityTooltip, styles[labelPosition], {
                        [styles.redTooltip]: affinity === AFFINITY_TYPES.MALUS,
                      })}
                    >
                      <p className={'text-xs font-normal text-white'}>
                        {getAffinityBonusSentence(
                          affinity as AFFINITY_TYPES,
                          (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size
                        )}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {showBonusTooltip !== affinity &&
              labelPosition === 'right' &&
              (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size > 0 ? (
                <p
                  className="py-[7px] px-[8px] text-sm font-semibold text-white"
                  style={{
                    background:
                      affinity === AFFINITY_TYPES.MALUS ? '#5A1F3B' : 'rgba(78, 72, 136, 0.7)',
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  {affinity === AFFINITY_TYPES.MALUS
                    ? `${computeCosmonMalusPercentForDeck(cosmons)}%`
                    : `+${(deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size}`}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    )
  }, [deckAffinities, showBonusTooltip, labelPosition, cosmons])

  const renderVariant = useMemo(() => {
    switch (variant) {
      case 'pills':
        return renderPills
      case 'short':
        return renderShort
      case 'badge':
        return renderBadge
      default:
        return null
    }
  }, [variant, deckAffinities, displayMalusInfoModal, showBonusTooltip, labelPosition])

  return renderVariant
}

export default DeckAffinities
