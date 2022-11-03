import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import { getCosmonStat, getScarcityByCosmon, getTrait, indexByCharacter } from '@utils/cosmon'
import countries from '@utils/countries'
import clsx from 'clsx'
import { motion, useAnimationControls } from 'framer-motion'
import { CosmonType } from 'types'
import styles from './CosmonCard.module.scss'
import Shimmer from '@components/Shimmer/Shimmer'
import theme from 'tailwind.config'

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
  const [imageLoaded, setImageLoaded] = useState(false)
  /* const controls = useAnimationControls()
  controls.start('default')

  const imgVariants = {
    default: {
      transform: 'scale(0)',
    },
    appear: {
      transform: 'scale(1)',
    },
  }
 */
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
      case 'aggressive':
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

  /* const handleLoadImage = (e: any) => {
    console.log('handleLoadImage :: ', e)
    setImageLoaded(true)
  }

  useEffect(() => {
    console.log('imageLoaded :: ', imageLoaded)
    if (imageLoaded === true) {
      controls.start('appear')
    }
  }, [imageLoaded]) */

  return (
    <div
      {...divProps}
      className={clsx(
        'relative flex h-full w-full',
        styles.cosmonCardContainer,
        divProps.className
      )}
      style={{
        ...divProps.style,
        ...containerStyle,
      }}
    >
      {/* {imageLoaded === false ? (
        <Shimmer style={{ background: theme.theme.extend.colors.cosmon.main.secondary }} />
      ) : null} */}

      <motion.img
        // onLoad={handleLoadImage}
        // variants={imgVariants}
        src={`https://static.foundation.ki/klub/images/cosmon/${indexByCharacter(
          cosmon.data.extension.name
        )}/evo-0/${scarcity?.toLowerCase()}.png`}
        // animate={controls}
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
            className="lg:m-1"
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
