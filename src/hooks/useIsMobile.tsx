import { useState, useEffect } from 'react'

const useIsMobileScreen = (): boolean => {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent

  const isAndroid = Boolean(userAgent.match(/Android/i))
  const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i))

  const [width, setWidth] = useState<null | number>(null)
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    handleWindowSizeChange()
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  if (!width) {
    return false
  }

  return width <= 768 || isAndroid || isIos
}

export default useIsMobileScreen
