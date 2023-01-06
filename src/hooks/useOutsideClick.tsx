import React, { useEffect, useState } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(ref: any) {
  const [isOutSide, setIsOutSide] = useState(false)
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOutSide(true)
      } else {
        setIsOutSide(false)
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return isOutSide
}
