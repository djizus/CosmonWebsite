import { toast } from 'react-toastify'
import create from 'zustand'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'
import { claimReward, getRewards } from '../services/interaction'
import { useWalletStore } from './walletStore'
import ErrorIcon from '/public/icons/error.svg'
import SuccessIcon from '/public/icons/success.svg'

interface RewardState {
  rewardsData?: {
    current: {
      amount: string
      denom: string
    }
    total: {
      amount: string
      denom: string
    }
  }
  getRewardsData: () => void
  claimRewards: () => any
}

const useRewardStore = create<RewardState>((set, get) => ({
  getRewardsData: async () => {
    const { address, signingClient } = useWalletStore.getState()

    if (signingClient && address) {
      const { current, total } = await getRewards(signingClient, address)
      set({
        rewardsData: {
          current,
          total,
        },
      })
    }
  },
  claimRewards: async () => {
    const { address, signingClient, fetchWalletData } =
      useWalletStore.getState()
    const { getRewardsData } = get()
    if (signingClient && address) {
      const response = await toast
        .promise(claimReward(signingClient, address), {
          pending: {
            render() {
              return (
                <ToastContainer type="pending">
                  {`Claiming current rewards`}
                </ToastContainer>
              )
            },
          },
          success: {
            render() {
              return (
                <ToastContainer type={'success'}>
                  Rewards claimed successfully,
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
        .then(async (response: any) => {
          await fetchWalletData()
          return response
        })
      return response
    }
  },
}))

export { useRewardStore }
