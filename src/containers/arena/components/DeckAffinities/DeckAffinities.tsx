import { AFFINITY_TYPES, DeckAffinities, NFTId } from '@services/deck'
import React, { useCallback, useMemo } from 'react'
import Geographical from '@public/icons/geographical.svg'
import Time from '@public/icons/time.svg'
import Personality from '@public/icons/personality.svg'
import styles from './DeckAffinities.module.scss'
import clsx from 'clsx'

interface DeckAffinitiesProps {
  deckAffinities: DeckAffinities
  variant: 'pills' | 'short'
  onHoverAffinity?: (affinityData: Set<NFTId>, affinity: AFFINITY_TYPES) => void
  onStopHoverAffinity?: () => void
}

const DeckAffinities: React.FC<DeckAffinitiesProps> = ({
  deckAffinities,
  variant,
  onHoverAffinity,
  onStopHoverAffinity,
}) => {
  const renderAffinityIcon = useCallback((affinity: AFFINITY_TYPES) => {
    switch (affinity) {
      case AFFINITY_TYPES.GEOGRAPHICAL:
        return <Geographical className="h-[17px] w-[17px]" />
      case AFFINITY_TYPES.PERSONALITY:
        return <Personality className="h-[17px] w-[17px]" />
      case AFFINITY_TYPES.TIME:
        return <Time className="h-[17px] w-[17px]" />
    }
  }, [])

  const renderPills = useMemo(() => {
    return (
      <div className="flex gap-[8px]">
        {Object.keys(deckAffinities).map((affinity, i) =>
          (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>).size >
          0 ? (
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
                +
                {
                  (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>)
                    .size
                }
              </p>
              &nbsp;
              <p className="font-semibold text-[#B1A8B9]">{affinity}</p>
              &nbsp;
              {renderAffinityIcon(affinity as AFFINITY_TYPES)}
            </div>
          ) : null
        )}
      </div>
    )
  }, [deckAffinities])

  const renderShort = useMemo(() => {
    return (
      <div className="flex rounded-[8px] bg-cosmon-main-quinary px-[10px] py-[12px] ">
        {Object.keys(deckAffinities)
          .map((affinity, i) => (
            <div key={affinity + '-' + i} className="flex items-center">
              {renderAffinityIcon(affinity as AFFINITY_TYPES)}
              <p className="ml-[5px] text-sm font-semibold text-white">
                +
                {
                  (deckAffinities[affinity as AFFINITY_TYPES] as Set<string>)
                    .size
                }
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
    )
  }, [deckAffinities])

  const renderVariant = useMemo(() => {
    switch (variant) {
      case 'pills':
        return renderPills
      case 'short':
        return renderShort
      default:
        return null
    }
  }, [variant, deckAffinities])

  return <div className="flex items-center">{renderVariant}</div>
}

export default DeckAffinities
