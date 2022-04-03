import { createTypedHooks } from 'easy-peasy'
import { GlobalModel } from './globalStore'

const typedHooks = createTypedHooks<GlobalModel>()

export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState
