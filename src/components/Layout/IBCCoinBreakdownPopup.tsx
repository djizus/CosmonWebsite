import Button from '@components/Button/Button'
import LoadingIcon from '@components/LoadingIcon/LoadingIcon'
import Tooltip from '@components/Tooltip/Tooltip'
import { useWalletStore } from '@store/walletStore'
import { getAmountFromDenom } from '@utils'
import React, { useEffect } from 'react'

interface IBCCoinBreakdownPopupProps {
  onClosePopup: () => void
}

const IBCCoinBreakdownPopup: React.FC<IBCCoinBreakdownPopupProps> = ({ onClosePopup }) => {
  const {
    ibcDenom,
    coins,
    setShowWithdrawDepositModal,
    ibcSigningClient,
    isLoadingIbcClientConnection,
    stargateSigningClient,
    getIbcSigningClient,
  } = useWalletStore()

  useEffect(() => {
    initIbcClient()
    return () => {}
  }, [])

  const initIbcClient = async () => {
    try {
      await getIbcSigningClient()
    } catch (error) {}
  }

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
            <div data-tip="tootlip" data-for={`ibcclient-not-available`}>
              <Button
                onClick={() => setShowWithdrawDepositModal('deposit')}
                size="small"
                type="secondary"
                disabled={!ibcSigningClient || !stargateSigningClient}
              >
                {isLoadingIbcClientConnection ? <LoadingIcon /> : 'Deposit'}
              </Button>
            </div>
            <div data-tip="tootlip" data-for={`ibcclient-not-available`}>
              <Button
                onClick={() => setShowWithdrawDepositModal('withdraw')}
                size="small"
                type="secondary"
                disabled={!ibcSigningClient || !stargateSigningClient}
              >
                {isLoadingIbcClientConnection ? <LoadingIcon /> : 'Withdraw'}
              </Button>
            </div>
            {!ibcSigningClient ? (
              <Tooltip id={`ibcclient-not-available`} place="top">
                <p>IBC Client not available</p>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default IBCCoinBreakdownPopup
