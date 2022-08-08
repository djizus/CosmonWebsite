import { useEffect, useRef } from 'react'

import {
  AnimationType,
  UnmaskOnReachProps,
} from '@components/UnmaskOnReach/UnmaskOnReach.types'
import styles from '@components/UnmaskOnReach/UnmaskOnReach.module.scss'
import { useOnScreen } from '@hooks/useOnScreen'

const UnmaskOnReach = ({
  children,
  animation = AnimationType.default,
  delay = '0s',
  className = '',
  disableRotation,
  reach = 0.75,
}: UnmaskOnReachProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const prevReachState = useRef<boolean>(false)
  const { isIntersecting: isOnScreen } = useOnScreen(containerRef, 0.1)
  console.log(delay)
  const defaultAnimStyle = (show: boolean) => {
    if (!containerRef?.current || !contentRef.current) {
      return
    }

    containerRef.current.style.transition =
      'all 2000ms cubic-bezier(0.16, 1, 0.3, 1)'
    contentRef.current.style.transition =
      'all 2000ms cubic-bezier(0.16, 1, 0.3, 1)'
    contentRef.current.style.transitionDelay = delay
    if (show) {
      containerRef.current.style.opacity = '100%'
      contentRef.current.style.opacity = '100%'
    } else {
      containerRef.current.style.opacity = '0%'
      contentRef.current.style.opacity = '0%'
    }
  }

  const riseAnimStyle = (show: boolean) => {
    if (!wrapperRef?.current || !contentRef?.current || !containerRef.current) {
      return
    }

    wrapperRef.current.style.transition =
      'all 2500ms cubic-bezier(0.16, 1, 0.3, 1)'
    contentRef.current.style.transition =
      'all 2500ms cubic-bezier(0.16, 1, 0.3, 1)'
    contentRef.current.style.transitionDelay = delay

    if (show) {
      wrapperRef.current.style.opacity = '100%'
      wrapperRef.current.style.transform = 'none'
      contentRef.current.style.opacity = '100%'
      contentRef.current.style.transform = 'none'
    } else {
      contentRef.current.style.transform = 'translateY(100%)'
      contentRef.current.style.opacity = '40%'
      wrapperRef.current.style.opacity = '40%'
    }
  }

  const AnimationStyle: any = {
    [AnimationType.default]: defaultAnimStyle,
    [AnimationType.rise]: riseAnimStyle,
  }

  const updateReached = () =>
    requestAnimationFrame(() => {
      if (
        containerRef.current &&
        wrapperRef.current &&
        contentRef.current &&
        isOnScreen
      ) {
        // Triggers if the dom element is at least in the top 75% of the window height
        const isReached =
          containerRef.current.getBoundingClientRect().top <
          window.innerHeight * reach

        if (isReached) {
          AnimationStyle[animation](true)
        } else {
          AnimationStyle[animation](false)
        }
        prevReachState.current = isReached
      }
    })

  useEffect(() => {
    updateReached()
    window.addEventListener('scroll', updateReached)
    return () => window.removeEventListener('scroll', updateReached)
  }, [isOnScreen])

  return (
    <div
      className={`${className} ${styles.masked} ${styles[animation]}`}
      ref={containerRef}
    >
      <div
        className={`${styles.wrapper} ${
          disableRotation ? styles.disableRotation : ''
        }`}
        ref={wrapperRef}
      >
        <div className={styles.content} ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default UnmaskOnReach
