import { CONNECTED_WITH, CONNECTION_TYPE } from 'types/Connection'

export const LS_KEY_WALLET_STATE = 'wallet'
export const LS_KEY_LAST_CONNECTION = 'last-connection'

export const saveLastConnection = (payload: {}) => {
  if (typeof window === 'undefined') {
    return
  }
  const prevState =
    localStorage?.getItem(LS_KEY_WALLET_STATE) &&
    JSON.parse(localStorage.getItem(LS_KEY_WALLET_STATE)!)
  if (prevState) {
    const prevStateCopy = {
      ...prevState.state,
      ...payload,
    }
    localStorage.setItem(LS_KEY_LAST_CONNECTION, JSON.stringify(prevStateCopy))
  }
}

export const wasPreviouslyConnected = () => {
  if (typeof window === 'undefined') {
    return
  }
  if (localStorage?.getItem(LS_KEY_LAST_CONNECTION)) {
    return JSON.parse(localStorage.getItem(LS_KEY_LAST_CONNECTION)!)
  }
  return false
}

export const removeLastConnection = () => {
  if (typeof window === 'undefined') {
    return
  }
  if (localStorage?.getItem(LS_KEY_LAST_CONNECTION)) {
    localStorage.removeItem(LS_KEY_LAST_CONNECTION)
  }
}

export const isConnectionTypeHandled = (type: CONNECTION_TYPE) => {
  if (Object.values(CONNECTION_TYPE).includes(type)) {
    return true
  }
  return false
}

export const getConnectedWithByType = (type: CONNECTION_TYPE) => {
  switch (type) {
    case CONNECTION_TYPE.COSMOSTATION:
    case CONNECTION_TYPE.COSMOSTATION_WALLET_CONNECT:
      return CONNECTED_WITH.COSMOSTATION
    case CONNECTION_TYPE.KEPLR:
      return CONNECTED_WITH.KEPLR
    default:
      return undefined
  }
}
