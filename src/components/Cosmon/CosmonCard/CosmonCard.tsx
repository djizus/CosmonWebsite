import { getScarcityByCosmon, indexByCharacter } from '@utils/cosmon'
import React, { useMemo } from 'react'
import { CosmonType } from 'types'

interface CosmonCardProps {
  cosmon: CosmonType
}

const CosmonCard: React.FC<CosmonCardProps> = ({ cosmon }) => {
  const scarcity = useMemo(() => {
    return getScarcityByCosmon(cosmon)
  }, [cosmon])

  return (
    <div
      className="relative flex h-full w-full rounded-[3px]"
      style={{
        backgroundImage: `url("https://static.foundation.ki/klub/images/cosmon/${indexByCharacter(
          cosmon.data.extension.name
        )}/evo-0/${scarcity?.toLowerCase()}.png")`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      {/* <img
        src={`https://static.foundation.ki/klub/images/cosmon/${indexByCharacter(
          cosmon.data.extension.name
        )}/evo/evo-0.png`}
        style={{
          height: '80%',
          width: '100%',
          objectFit: 'contain',
          position: 'absolute',
          top: '2%',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '73%',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <p className="text-[0.8rem] text-white" style={{ lineHeight: '14px' }}>
          {cosmon.data.extension.name}
        </p>
      </div> */}
    </div>
  )
}

export default CosmonCard
