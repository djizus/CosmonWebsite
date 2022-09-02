import { getCosmonStat, getScarcityByCosmon, getTrait, indexByCharacter } from '@utils/cosmon'
import clsx from 'clsx'
import React, { CSSProperties, useCallback, useMemo } from 'react'
import { CosmonType } from 'types'

interface CosmonCardProps {
  cosmon: CosmonType
  containerStyle?: CSSProperties
  imgStyle?: CSSProperties
  showPersonality?: boolean
  showLevel?: boolean
}

const CosmonCard: React.FC<
  CosmonCardProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({
  cosmon,
  containerStyle,
  imgStyle,
  showPersonality = false,
  showLevel = false,
  ...divProps
}) => {
  const scarcity = useMemo(() => {
    return getScarcityByCosmon(cosmon)
  }, [cosmon])

  const level = useMemo(() => {
    return getCosmonStat(cosmon.stats!, 'Level')?.value
  }, [cosmon])

  const personality = useMemo(() => {
    return getTrait(cosmon, 'Personality')
  }, [cosmon])

  const geo = useMemo(() => {
    return getTrait(cosmon, 'Geographical')
  }, [cosmon])

  const personaityIconWidth = (perso: string) => {
    switch (perso) {
      case 'agressive':
      case 'creative':
      case 'dynamic':
      case 'erudite':
      case 'expansive':
      case 'financial':
      case 'spiritual':
        return '25%'
      case 'tactical':
        return '15%'
    }
  }

  return (
    <div
      {...divProps}
      className={clsx('relative flex h-full w-full rounded-[3px]', divProps.className)}
      style={{
        ...divProps.style,
        ...containerStyle,
      }}
    >
      <img
        src={`https://static.foundation.ki/klub/images/cosmon/${indexByCharacter(
          cosmon.data.extension.name
        )}/evo-0/${scarcity?.toLowerCase()}.png`}
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'contain',
          ...imgStyle,
        }}
      />

      <div
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
          bottom: '2%',
          paddingLeft: '8%',
          paddingRight: '8%',
        }}
      >
        <div className="flex flex-col items-center">
          {showPersonality ? (
            <>
              <img
                src={`/cosmons/personality-icons/${personality?.toLowerCase()}.svg`}
                style={{ width: personaityIconWidth(personality?.toLowerCase()!) }}
              />
              <p className="text-[0.6rem] font-normal text-white">{personality?.toUpperCase()}</p>
            </>
          ) : null}
        </div>
        <div>
          <p className="text-[0.8rem] text-white">{/* {geo} */}</p>
        </div>
        <div className="flex flex-col items-center">
          {showLevel ? (
            <>
              <p className="text-[0.8rem] font-bold text-white" style={{ lineHeight: '10px' }}>
                {level}
              </p>
              <p className="text-[0.6rem] font-normal text-white">LEVEL</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CosmonCard
