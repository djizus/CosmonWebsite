import Button from '@components/Button/Button'
import { useWalletStore } from '@store/walletStore'
import { getAmountFromDenom } from '@utils'
import React from 'react'

interface IBCCoinBreakdownPopupProps {
  onClosePopup: () => void
}

const IBCCoinBreakdownPopup: React.FC<IBCCoinBreakdownPopupProps> = ({ onClosePopup }) => {
  const { ibcDenom, coins, setShowWithdrawDepositModal, ibcSigningClient, stargateSigningClient } =
    useWalletStore()

  return (
    <>
      <div
        onClick={onClosePopup}
        className="fixed left-0 top-0 z-[40] h-full w-full bg-[rgba(27,27,27,0.5)]"
      ></div>
      <div className="absolute top-14 right-0 z-[50] w-[327px] rounded-xl border-[0.5px] border-[#A996FF] border-opacity-50 bg-cosmon-main-secondary p-5">
        <div className="font-[14px]  text-white">
          <div className="font-semibold">Your {ibcDenom?.toUpperCase()} Breakdown</div>
          <div className="flex flex-col gap-y-1 pt-4">
            <div className="flex justify-between">
              <div> {ibcDenom?.toUpperCase()} balance </div>
              <div>
                {getAmountFromDenom(process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '', coins)}{' '}
                {ibcDenom?.toUpperCase() || ''}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              onClick={() => setShowWithdrawDepositModal('deposit')}
              size="small"
              type="secondary"
              disabled={!ibcSigningClient || !stargateSigningClient}
            >
              Deposit
            </Button>
            <Button
              onClick={() => setShowWithdrawDepositModal('withdraw')}
              size="small"
              type="secondary"
              disabled={!ibcSigningClient || !stargateSigningClient}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default IBCCoinBreakdownPopup
