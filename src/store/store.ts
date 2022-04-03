import { createStore } from 'easy-peasy'
import { GlobalModel, globalStore } from './globalStore'

export const store = createStore<GlobalModel>({
  ...globalStore,
})
