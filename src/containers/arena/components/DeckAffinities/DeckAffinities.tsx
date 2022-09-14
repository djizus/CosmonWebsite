import { AFFINITY_TYPES, DeckAffinitiesType, NFTId } from 'types'
import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Geographical from '@public/icons/geographical.svg'
import Time from '@public/icons/time.svg'
import Personality from '@public/icons/personality.svg'
import Hexagon, { HexagonProps } from '@components/Hexagon/Hexagon'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './DeckAffinities.module.scss'

export type BadgeOptions = HexagonProps

interface DeckAffinitiesProps {
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

  const renderAffinityIcon = useCallback((affinity: AFFINITY_TYPES, size = 17) => {
    switch (affinity) {
      case AFFINITY_TYPES.GEOGRAPHICAL:
        return <Geographical style={{ width: size, height: size }} />
      case AFFINITY_TYPES.PERSONALITY:
        return <Personality style={{ width: size, height: size }} />
      case AFFINITY_TYPES.TIME:
        return <Time style={{ width: size, height: size }} />
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
    }
  }

  const renderPills = useMemo(() => {
    return (
      <div className="flex items-center" style={containerStyle}>
        <div className="flex gap-[8px]">
          {Object.keys(deckAffinities).map((affinity, i) =>
            (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size > 0 ? (
              <div
                className="flex cursor-help items-center rounded-xl bg-cosmon-main-quinary px-[11px] py-[8px]"
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
                <p className="font-semibold text-white">
                  +{(deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size}
                </p>
                &nbsp;
                <p className="font-semibold text-[#B1A8B9]">{affinity}</p>
                &nbsp;
                {renderAffinityIcon(affinity as AFFINITY_TYPES)}
              </div>
            ) : null
          )}
        </div>
      </div>
    )
  }, [deckAffinities])

  const renderShort = useMemo(() => {
    return (
      <div className="flex items-center" style={containerStyle}>
        <div className="flex rounded-[8px] bg-cosmon-main-quinary px-[10px] py-[12px] ">
          {Object.keys(deckAffinities)
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
      </div>
    )
  }, [deckAffinities])

  const renderBadge = useMemo(() => {
    return (
      <div
        className={clsx(`absolute flex gap-[12px]`, { 'flex-col': direction === 'column' })}
        style={containerStyle}
      >
        {Object.keys(deckAffinities).map((affinity, i) => (
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
                +{(deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size}
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
              <Hexagon width={59} height={67} {...options}>
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
                    className={clsx(styles.affinityTooltip, styles[labelPosition])}
                  >
                    <p className="text-xs font-normal text-white">
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
                  background: 'rgba(78, 72, 136, 0.7)',
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                +{(deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    )
  }, [deckAffinities, showBonusTooltip, labelPosition])

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
  }, [variant, deckAffinities, showBonusTooltip, labelPosition])

  return renderVariant
}

export default DeckAffinities
