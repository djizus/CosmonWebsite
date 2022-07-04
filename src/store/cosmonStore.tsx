import { toast } from 'react-toastify'
import create from 'zustand'
import { Scarcity } from '../../types/Scarcity'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import {
  queryCosmonAvailableByScarcity,
  queryCosmonPrice,
  queryGetWhitelistInfo,
  queryPreSellOpen,
  querySellOpen,
} from '../services/interaction'
import { convertMicroDenomToDenom } from '../utils/conversion'
import { useWalletStore } from './walletStore'
import ErrorIcon from '/public/icons/error.svg'
import SuccessIcon from '/public/icons/success.svg'

interface CosmonState {
  whitelistData?: {
    discount_percent: number
    available_slots: number
    used_slots: number
  }
  isSellOpen: undefined | boolean
  isPreSellOpen: undefined | boolean
  getCosmonScarcityAvailable: (scarcity: Scarcity) => Promise<number>
  getCosmonPrice: (scarcity: Scarcity) => Promise<string>
  getWhitelistData: () => void
  resetWhitelistData: () => void
  fetchSellData: () => void
  // isPreSellOpen: () => Promise<boolean>
  // isSellOpen: () => Promise<boolean>
  isCosmonBuyable: (scarcity?: Scarcity) => void
}

const useCosmonStore = create<CosmonState>((set, get) => ({
  isSellOpen: undefined,
  isPreSellOpen: undefined,
  getWhitelistData: async () => {
    const { address, signingClient } = useWalletStore.getState()

    const response =
      signingClient && (await queryGetWhitelistInfo(signingClient, address))
    set({
      whitelistData: response,
    })
  },
  isCosmonBuyable: async (scarcity?: Scarcity) => {
    // if (isCosmon)
    if (scarcity) {
    }
  },
  fetchSellData: async () => {
    const { signingClient } = useWalletStore.getState()
    set({
      isSellOpen: signingClient && (await querySellOpen(signingClient)),
      isPreSellOpen: signingClient && (await queryPreSellOpen(signingClient)),
    })

    // return signingClient && (await queryPreSellOpen(signingClient))
    // return signingClient && (await querySellOpen(signingClient))
  },
  // isPreSellOpen: async () => {

  // },
  // isSellOpen: async () => {
  //   const { signingClient } = useWalletStore.getState()

  // },

  getCosmonScarcityAvailable: async (scarcity): Promise<number> => {
    const { signingClient } = useWalletStore.getState()
    const { getWhitelistData } = get()
    await getWhitelistData()

    if (signingClient) {
      const result = await queryCosmonAvailableByScarcity(
        signingClient,
        scarcity
      )
      return result?.count || 0
    }
    return 0
  },
  getCosmonPrice: async (scarcity: Scarcity) => {
    const { signingClient } = useWalletStore.getState()

    const amount =
      signingClient && (await queryCosmonPrice(signingClient, scarcity))
    if (amount) {
      return convertMicroDenomToDenom(amount) + ''
    } else {
      return 'XX'
    }
  },

  resetWhitelistData: () => {
    set({
      whitelistData: undefined,
    })
  },
}))

export { useCosmonStore }
