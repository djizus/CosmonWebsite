import React, { CSSProperties, useMemo, useRef, useState } from 'react'
import { getCosmonStat, getScarcityByCosmon, getTrait, indexByCharacter } from '@utils/cosmon'
import countries from '@utils/countries'
import clsx from 'clsx'
import { motion, useMotionValue, useTransform, HTMLMotionProps } from 'framer-motion'
import { CosmonType } from 'types'
import styles from './CosmonCard.module.scss'
import { round } from '@utils/math'

interface CosmonCardProps {
  cosmon: CosmonType
  containerStyle?: CSSProperties
  imgStyle?: CSSProperties
  showPersonality?: boolean
  showScarcity?: boolean
  showNationality?: boolean
  showLevel?: boolean
  showPerspectiveAnimation?: boolean
  showGlareAnimation?: boolean
  combatState?: 'idle' | 'attacking' | 'defending'| 'dodge'| 'defendingCrit' | 'critical'
  size?: 'sm' | 'md' | 'lg'
}

const CosmonCard: React.FC<CosmonCardProps & HTMLMotionProps<'div'>> = ({
  cosmon,
  containerStyle,
  imgStyle,
  showPersonality = false,
  showScarcity = false,
  showNationality = false,
  showLevel = false,
  showPerspectiveAnimation = false,
  showGlareAnimation = false,
  combatState = "static",
  size = 'md',
  ...divProps
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const rotateMotionY = useMotionValue(0.5)
  const rotateMotionX = useMotionValue(0.5)

  const rotateX = useTransform(rotateMotionY, [0, 1], [10, -10], { clamp: true })
  const rotateY = useTransform(rotateMotionX, [0, 1], [-10, 10], { clamp: true })

  const glareMotionOpacity = useMotionValue(0)
  const glareOpacity = useTransform(glareMotionOpacity, [0, 1], [0, 1])

  const [glareX, setGlareX] = useState(50)
  const [glareY, setGlareY] = useState(50)

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

  const handlePointerMoveCard = (e: any) => {
    const bounds = e.currentTarget?.getBoundingClientRect()
    if (!bounds) return

    if (e.type === 'touchmove') {
      e.clientX = e.touches[0].clientX
      e.clientY = e.touches[0].clientY
    }

    const absolute = {
      x: e.clientX - bounds.x,
      y: e.clientY - bounds.y,
    }

    const percent = {
      x: round((100 / bounds.width) * absolute.x),
      y: round((100 / bounds.height) * absolute.y),
    }

    // set x,y local coordinates
    const xValue = absolute.x / e.currentTarget.clientWidth
    const yValue = absolute.y / e.currentTarget.clientHeight

    rotateMotionY.set(yValue, true)
    rotateMotionX.set(xValue, true)

    setGlareX(percent.x)
    setGlareY(percent.y)
    glareMotionOpacity.set(0.6, true)
  }

  const handlePointerLeave = () => {
    rotateMotionX.set(0.5, true)
    rotateMotionY.set(0.5, true)

    setGlareX(50)
    setGlareY(50)
    glareMotionOpacity.set(0, true)
  }

  //const numericLevel = parseInt(level ?? "0", 10);
  //const evoLevel = numericLevel < 15 ? "evo-0" :
  //    (numericLevel < 30 ? "evo-1" : "evo-2");
  const evoLevel = "evo-0"
  const videoSrc = useMemo(() => {
    switch(combatState) {
      case 'idle':
        return `https://scrappo.trade/${indexByCharacter(
            cosmon.data.extension.name
        )}/${scarcity?.toLowerCase()}/idle.mp4`;
      case 'attacking':
        return `https://scrappo.trade/${indexByCharacter(
            cosmon.data.extension.name
        )}/${scarcity?.toLowerCase()}/attack.mp4`;
      case 'defending':
        return `https://scrappo.trade/${indexByCharacter(
            cosmon.data.extension.name
        )}/${scarcity?.toLowerCase()}/defense.mp4`;
      case 'dodge':
        return `https://scrappo.trade/${indexByCharacter(
            cosmon.data.extension.name
        )}/${scarcity?.toLowerCase()}/dodge.mp4`;
      case 'defendingCrit':
        return `https://scrappo.trade/${indexByCharacter(
            cosmon.data.extension.name
        )}/${scarcity?.toLowerCase()}/defensecrit.mp4`;
      case 'critical':
        return `https://scrappo.trade/${indexByCharacter(
            cosmon.data.extension.name
        )}/${scarcity?.toLowerCase()}/critical.mp4`;
      default:
        return `https://static.foundation.ki/klub/images/cosmon/${indexByCharacter(
            cosmon.data.extension.name
        )}/${evoLevel}/${scarcity?.toLowerCase()}.png`; // Image par défaut si nécessaire
    }
  }, [combatState, cosmon.data.extension.name]);

  return (
    <div
      style={{
        perspective: 600,
        display: 'grid',
        willChange: 'transform',
        height: '100%',
      }}
    >
      <motion.div
          {...divProps}
          ref={cardRef}
          className={clsx(
              'relative flex h-full w-full',
              styles.cosmonCardContainer,
              divProps.className
          )}
          onPointerMove={handlePointerMoveCard}
          onMouseOut={handlePointerLeave}
          style={{
            ...divProps.style,
            ...containerStyle,
            ...(showPerspectiveAnimation && {rotateY}),
            ...(showPerspectiveAnimation && {rotateX}),
            overflow: 'hidden',
          }}
      >
        {
          videoSrc.endsWith('.png') ? (
              <motion.img
                  src={videoSrc}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                    ...imgStyle,
                  }}
              />
          ) : (
              <motion.video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={videoSrc}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                    ...imgStyle,
                  }}
              />
          )
        }

        {showGlareAnimation ? (
            <motion.div
                style={{
                  position: 'absolute',
                  transform: 'translateZ(1.4px)',
                  background: `radial-gradient(farthest-corner circle at ${glareX}% ${glareY}%,rgba(255,255,255,.8) 10%,rgba(255,255,255,.65) 20%,rgba(0,0,0,.5) 90%)`,
                  mixBlendMode: 'overlay',
                  opacity: glareOpacity,
                  width: '100%',
                  height: '100%',
                }}
            />
        ) : null}

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
                      style={{width: personalityIconWidth(personality?.toLowerCase()!)}}
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
      </motion.div>
    </div>
  )
}

export default CosmonCard
