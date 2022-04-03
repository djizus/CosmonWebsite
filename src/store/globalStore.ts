import { createStore, persist, action, thunk } from 'easy-peasy'
import { Action, Thunk } from 'easy-peasy'
import { connectWallet } from '../utils'

type WalletActionType = {
  action: 'connect' | 'disconnect'
}

export type GlobalModel = {
  walletAction: Thunk<GlobalModel, WalletActionType>
  setIsConnected: Action<GlobalModel, boolean>
  isConnected: boolean
}

export const globalStore: GlobalModel = {
  walletAction: thunk(async (actions, payload) => {
    if (payload.action === 'connect') {
      await connectWallet()
      actions.setIsConnected(true)
    } else {
      actions.setIsConnected(false)
    }
  }),
  setIsConnected: action((state, payload) => {
    state.isConnected = payload
  }),
  isConnected: false,
}
