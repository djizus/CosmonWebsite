import { useWindowSize } from 'react-use'

export function isMobile() {
  const { width } = useWindowSize()

  return width < 640
}
