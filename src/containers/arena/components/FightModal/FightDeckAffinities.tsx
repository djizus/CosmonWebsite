import { useDeckStore } from '@store/deckStore'
import React, { useMemo } from 'react'
import { AFFINITY_TYPES, CosmonType } from 'types'
import { CosmonTypeWithMalus } from 'types/Malus'
import DeckAffinities from '../DeckAffinities/DeckAffinities'

interface FightDeckAffinitiesProps {
  cosmons: CosmonTypeWithMalus[]
  side: 'opponent' | 'me'
  onHoverAffinity?: (affinityData: Set<string>, affinity: AFFINITY_TYPES) => void
  onHoverStopAffinity?: () => void
}

const FightDeckAffinities: React.FC<FightDeckAffinitiesProps> = ({
  cosmons,
  side,
  onHoverAffinity,
  onHoverStopAffinity,
}) => {
  const { computeDeckAffinities } = useDeckStore()

  const affinities = useMemo(() => {
    return computeDeckAffinities(cosmons)
  }, [cosmons])

  return (
    <div className={`relative flex items-center`}>
      <div
        style={{
          width: 49,
          height: 325,
          borderWidth: 2,
          background: side === 'me' ? '#403D5D' : 'transparent',
          borderStyle: 'solid',
          borderImage: 'linear-gradient(180deg, #A996FF 0%, rgba(76, 54, 173, 0.5) 100%) 1',
          transform:
            side === 'me'
              ? 'perspective(20vh) rotateY(20deg)'
              : 'perspective(20vh) rotateY(-20deg)',
          ...(side === 'me' ? { borderLeft: 0 } : { borderRight: 0 }),
        }}
      />
      <DeckAffinities
        cosmons={cosmons}
        deckAffinities={affinities}
        variant="badge"
        direction="column"
        options={side === 'opponent' ? { reverseHover: true } : {}}
        containerStyle={side === 'opponent' ? { right: 16 } : { left: 16 }}
        labelPosition={side === 'opponent' ? 'left' : 'right'}
        onHoverAffinity={onHoverAffinity}
        onStopHoverAffinity={onHoverStopAffinity}
      />
    </div>
  )
}

export default FightDeckAffinities
