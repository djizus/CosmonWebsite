import { getCosmonStat, getScarcityByCosmon, getTrait, indexByCharacter } from '@utils/cosmon'
import countries from '@utils/countries'
import clsx from 'clsx'
import React, { CSSProperties, useMemo } from 'react'
import { CosmonType } from 'types'
import styles from './CosmonCard.module.scss'

interface CosmonCardProps {
  cosmon: CosmonType
  containerStyle?: CSSProperties
  imgStyle?: CSSProperties
  showPersonality?: boolean
  showScarcity?: boolean
  showNationality?: boolean
  showLevel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const CosmonCard: React.FC<
  CosmonCardProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({
  cosmon,
  containerStyle,
  imgStyle,
  showPersonality = false,
  showScarcity = false,
  showNationality = false,
  showLevel = false,
  size = 'md',
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

  const nationality = useMemo(() => {
    const countryCode = getTrait(cosmon, 'Nationality')
    if (!countryCode) {
      return
    }
    return countries.find((c) => c.tld[0]?.includes(countryCode))
  }, [cosmon])

  const personalityIconWidth = (perso: string) => {
    switch (perso) {
      case 'agressive':
      case 'creative':
      case 'dynamic':
      case 'erudite':
      case 'expansive':
      case 'financial':
      case 'spiritual':
        return '30%'
      case 'tactical':
        return '20%'
    }
  }

  return (
    <div
      {...divProps}
      className={clsx(
        'relative flex h-full w-full rounded-[3px]',
        styles.cosmonCardContainer,
        divProps.className
      )}
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

      {showScarcity ? (
        <div className={clsx(styles.scarcityContainer, styles[size])}>
          <img
            className="m-1"
            src={`/rarity-levels/${getScarcityByCosmon(cosmon)!.toLowerCase()}.png`}
          />
          <p>{getScarcityByCosmon(cosmon)}</p>
        </div>
      ) : null}

      <div className={clsx(styles.attributsContainer, styles[size])}>
        <div className="flex flex-col items-center">
          {showPersonality ? (
            <>
              <img
                src={`/cosmons/personality-icons/${personality?.toLowerCase()}.svg`}
                style={{ width: personalityIconWidth(personality?.toLowerCase()!) }}
              />
              <p className={clsx(styles.label, styles[size])}>{personality?.toUpperCase()}</p>
            </>
          ) : null}
        </div>
        <div className="flex flex-col items-center">
          {showNationality ? (
            <>
              <span className={clsx(styles.flag, styles[size])}>{nationality?.flag}</span>
              <p className={clsx(styles.label, styles[size])}>
                {nationality?.name?.common?.toUpperCase()}
              </p>
            </>
          ) : null}
        </div>
        <div className="flex flex-col items-center">
          {showLevel ? (
            <>
              <p className={clsx(styles.level, styles[size])}>{level}</p>
              <p className={clsx(styles.label, styles[size])}>LEVEL</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CosmonCard
