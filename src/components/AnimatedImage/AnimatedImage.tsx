import { round } from '@utils/math'
import clsx from 'clsx'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import React, { useRef, useState } from 'react'
import styles from './AnimatedImage.module.scss'

interface AnimatedImageProps {
  imgSrc: string
  imgClassName: string
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({ imgSrc, imgClassName }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const rotateMotionY = useMotionValue(0.5)
  const rotateMotionX = useMotionValue(0.5)

  const rotateX = useTransform(rotateMotionY, [0, 1], [10, -10], { clamp: true })
  const rotateY = useTransform(rotateMotionX, [0, 1], [-10, 10], { clamp: true })

  const glareMotionOpacity = useMotionValue(0)
  const glareOpacity = useTransform(glareMotionOpacity, [0, 1], [0, 1])

  const [glareX, setGlareX] = useState(50)
  const [glareY, setGlareY] = useState(50)

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

  return (
    <div
      style={{
        perspective: 600,
        display: 'grid',
        willChange: 'transform',
      }}
    >
      <motion.div
        ref={cardRef}
        className={clsx('relative ', styles.container)}
        onPointerMove={handlePointerMoveCard}
        onMouseOut={handlePointerLeave}
        style={{
          rotateY,
          rotateX,
          overflow: 'hidden',
        }}
      >
        <motion.img src={imgSrc} className={imgClassName} />

        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            right: '50%',
            transform: 'translate3d(50%, -50%, 1.4px)',
            background: `radial-gradient(farthest-corner circle at ${glareX}% ${glareY}%,rgba(255,255,255,.8) 10%,rgba(255,255,255,.65) 20%,rgba(0,0,0,.5) 90%) center center`,
            mixBlendMode: 'overlay',
            opacity: glareOpacity,
            width: '100%',
            height: '99%',
            borderRadius: 0,
          }}
        />
      </motion.div>
    </div>
  )
}

export default AnimatedImage
