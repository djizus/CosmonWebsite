import { isMobile as isMobileWC } from '@walletconnect/browser-utils'

export function isMobile() {
  return isMobileWC()
}
