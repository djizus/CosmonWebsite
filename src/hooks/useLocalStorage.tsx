import { useEffect, useState } from 'react'

export type LocalStorageItem = {
  key: string
  value: string | object
}

export function useLocalStorage(testKeyPresence?: string) {
  const [isKeyInLocalStorage, setIsKeyInLocalStorage] = useState(false)

  useEffect(() => {
    if (testKeyPresence) {
      if (getItem(testKeyPresence)) {
        setIsKeyInLocalStorage(true)
      }
    }
  }, [isKeyInLocalStorage])

  const setItem = (key: string, value: string | object) => {
    if (!window?.localStorage) return
    window.localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
  }

  const getItem = (key: string) => {
    if (!window?.localStorage) return
    return window.localStorage.getItem(key)
  }

  const removeItem = (key: string) => {
    if (!window?.localStorage) return
    window.localStorage.removeItem(key)
  }

  return { setItem, getItem, removeItem, isKeyInLocalStorage }
}
