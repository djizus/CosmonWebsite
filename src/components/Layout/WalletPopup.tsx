import { useWalletStore } from '../../store/walletStore'
import { useRewardStore } from '../../store/rewardStore'
import { getAmountFromDenom } from '../../utils/index'
import Button from '../Button/Button'
import { convertMicroDenomToDenom } from '../../utils/conversion'

type WalletPopupProps = {
  onClosePopup: () => void
}

export default function WalletPopup({ onClosePopup }: WalletPopupProps) {
  const { initIbc, isFetchingData, coins, setShowWithdrawDepositModal } =
    useWalletStore((state) => state)

  const { rewardsData, claimRewards } = useRewardStore((state) => state)

  return (
    <>
      <div
        onClick={onClosePopup}
        className="fixed left-0 top-0 z-[40] h-full w-full bg-[rgba(27,27,27,0.5)]"
      ></div>
      <div className="absolute top-14 right-0 z-[50] w-[327px] rounded-xl border-[0.5px] border-[#A996FF] border-opacity-50 bg-cosmon-main-secondary p-5">
        <div className="font-[14px]  text-white">
          <div className="font-semibold">
            Your {process.env.NEXT_PUBLIC_DENOM || ''} Breakdown
          </div>
          <div className="flex flex-col gap-y-1 pt-4">
            <div className="flex justify-between">
              <div> {process.env.NEXT_PUBLIC_DENOM || ''} balance </div>
              <div>
                {getAmountFromDenom(
                  process.env.NEXT_PUBLIC_STAKING_DENOM || '',
                  coins
                )}{' '}
                {process.env.NEXT_PUBLIC_DENOM || ''}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>{process.env.NEXT_PUBLIC_DENOM || ''} to claim</div>
              <div className="flex gap-x-[10px]">
                {/* <div className="font-semibold text-cosmon-main-tertiary"> */}
                <Button onClick={claimRewards} type="ghost">
                  Claim
                </Button>
                {convertMicroDenomToDenom(rewardsData?.current.amount || 0)}{' '}
                {process.env.NEXT_PUBLIC_DENOM || ''}
              </div>
            </div>
            <div className="flex justify-between">
              <div> {process.env.NEXT_PUBLIC_DENOM || ''} earned </div>
              <div>
                {convertMicroDenomToDenom(rewardsData?.total.amount || 0)}{' '}
                {process.env.NEXT_PUBLIC_DENOM || ''}{' '}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              // isLoading={isWalletLoading}
              onClick={() => setShowWithdrawDepositModal('deposit')}
              size="small"
              type="secondary"
            >
              Deposit
            </Button>
            <Button
              onClick={() => setShowWithdrawDepositModal('withdraw')}
              size="small"
              type="secondary"
            >
              Withdraw
            </Button>
          </div>

          {/* <div className="pt-6">
            <Button fullWidth type="secondary" className="max-h-[42px]">
              Prize Pool: $1,000,000.13
            </Button>
          </div> */}
        </div>
      </div>
    </>
  )
}
