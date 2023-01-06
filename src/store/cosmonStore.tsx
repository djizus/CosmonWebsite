import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/cosmwasmclient'
import { Coin } from '@cosmjs/proto-signing'
import { XPRegistryService } from '@services/xp-registry'
import { computeStatsWithoutBoosts, fillBoosts } from '@utils/boost'
import create from 'zustand'
import { Scarcity } from '../../types'
import {
  queryCosmonAvailableByScarcity,
  queryCosmonBlindMintPrice,
  queryCosmonInfo,
  queryCosmonPrice,
  queryGetWhitelistInfo,
  queryPreSellOpen,
  querySellOpen,
} from '../services/interaction'
import { convertMicroDenomToDenom } from '../utils/conversion'
import { useWalletStore } from './walletStore'

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
  getBlindMintPrice: () => Promise<Coin | null>
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

    const response = signingClient && (await queryGetWhitelistInfo(signingClient, address))
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
  },
  getCosmonScarcityAvailable: async (scarcity): Promise<number> => {
    const { signingClient } = useWalletStore.getState()
    const { getWhitelistData } = get()
    await getWhitelistData()

    if (signingClient) {
      const result = await queryCosmonAvailableByScarcity(signingClient, scarcity)
      return result?.count || 0
    }
    return 0
  },
  getCosmonPrice: async (scarcity: Scarcity) => {
    const { signingClient } = useWalletStore.getState()
    let generatedClient
    let amount
    if (!signingClient) {
      generatedClient = await CosmWasmClient.connect(
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
      )
    }
    if (signingClient) {
      amount = signingClient && (await queryCosmonPrice(signingClient, scarcity))
    } else if (generatedClient) {
      amount = generatedClient && (await queryCosmonPrice(generatedClient, scarcity))
    }

    if (amount) {
      return convertMicroDenomToDenom(amount) + ''
    } else {
      return 'XX'
    }
  },
  getBlindMintPrice: async () => {
    const { signingClient } = useWalletStore.getState()
    let generatedClient
    let amount
    if (!signingClient) {
      generatedClient = await CosmWasmClient.connect(
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
      )
    }
    if (signingClient) {
      amount = signingClient && (await queryCosmonBlindMintPrice(signingClient))
    } else if (generatedClient) {
      amount = generatedClient && (await queryCosmonBlindMintPrice(generatedClient))
    }

    if (amount) {
      return amount
    } else {
      return null
    }
  },
  resetWhitelistData: () => {
    set({
      whitelistData: undefined,
    })
  },
}))

export { useCosmonStore }
