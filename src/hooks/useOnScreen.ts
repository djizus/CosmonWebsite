import { RefObject, useEffect, useRef, useState } from 'react'

export const useOnScreen = <T>(ref: RefObject<T>, intersection = 0.5) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const data = useRef<IntersectionObserverEntry>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.intersectionRatio > intersection)
        data.current = entry
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    if (ref?.current) {
      observer.observe(ref.current as unknown as Element)
    }

    return () => observer.disconnect()
  }, [])

  return { isIntersecting, entry: data.current }
}
