import { useState, useEffect } from 'react'

const useIsMobileScreen = (): boolean => {
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

  return width <= 768
}

export default useIsMobileScreen
