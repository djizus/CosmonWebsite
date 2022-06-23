import { toast } from 'react-toastify'
import create from 'zustand'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import {
  executeClaimAirdrop,
  queryCheckAirdropEligibility,
  queryGetClaimData,
} from '../services/interaction'
import { useWalletStore } from './walletStore'
import ErrorIcon from '/public/icons/error.svg'
import SuccessIcon from '/public/icons/success.svg'

interface AirdropState {
  airdropData?: {
    isEligible: boolean
    address?: string
    max_claimable?: number
    num_already_claimed?: number
  }
  getAirdropData: () => void
  claimAirdrop: () => any
  resetAirdropData: () => void
}

const useAirdropStore = create<AirdropState>((set, get) => ({
  getAirdropData: async () => {
    const { airdropData } = get()
    const { address, signingClient } = useWalletStore.getState()

    const toastId = toast.loading(
      airdropData
        ? 'Refreshing airdrop data, please wait..'
        : 'Fetching airdrop data, please wait..'
    )

    const isEligible =
      signingClient &&
      (await queryCheckAirdropEligibility(signingClient, address))

    if (!isEligible) {
      set({
        airdropData: {
          isEligible: false,
        },
      })
    } else {
      const claimData =
        signingClient && (await queryGetClaimData(signingClient, address))
      console.log('claimData', claimData)
      set({
        airdropData: {
          isEligible: true,
          ...claimData,
        },
      })
    }
    toast.dismiss(toastId)
  },
  claimAirdrop: async () => {
    const { getAirdropData } = get()
    const { address, signingClient } = useWalletStore.getState()
    if (signingClient && address) {
      console.log('here')
      const response = await toast
        .promise(executeClaimAirdrop(signingClient, address), {
          pending: {
            render() {
              return (
                <ToastContainer type="pending">
                  {`Claiming cosmon airdrop`}
                </ToastContainer>
              )
            },
          },
          success: {
            render() {
              return (
                <ToastContainer type={'success'}>
                  Cosmon claimed successfully,
                </ToastContainer>
              )
            },
            icon: SuccessIcon,
          },

          error: {
            render({ data }: any) {
              return (
                <ToastContainer type="error">{data.message}</ToastContainer>
              )
            },
            icon: ErrorIcon,
          },
        })
        .then(async ({ token }: any) => {
          await getAirdropData()
          useWalletStore.getState().fetchCosmons()
          return token
        })
      return response
    }
  },
  resetAirdropData: () => {
    set({
      airdropData: undefined,
    })
  },
}))

export { useAirdropStore }
