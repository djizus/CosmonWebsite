import Button from '@components/Button/Button'
import LoadingIcon from '@components/LoadingIcon/LoadingIcon'
import Tooltip from '@components/Tooltip/Tooltip'
import { Coin } from '@cosmjs/proto-signing'
import { useWalletStore } from '@store/walletStore'
import { getAmountFromDenom } from '@utils'
import { isMobile } from '@utils/browser'
import React, { useCallback, useEffect } from 'react'

interface IBCBalanceProps {}

const IBCBalance: React.FC<IBCBalanceProps> = ({}) => {
  const { coins, setShowWithdrawDepositModal } = useWalletStore()

  const handleClickDeposit = useCallback(() => {
    setShowWithdrawDepositModal('deposit')
  }, [])

  const handleClickWithdraw = useCallback(() => {
    setShowWithdrawDepositModal('withdraw')
  }, [])

  return (
    <>
      {isMobile() ? (
        <IBCBalanceMobile
          coins={coins}
          onClickDeposit={handleClickDeposit}
          onClickWithdraw={handleClickWithdraw}
        />
      ) : (
        <IBCBalanceDesktop
          coins={coins}
          onClickDeposit={handleClickDeposit}
          onClickWithdraw={handleClickWithdraw}
        />
      )}
    </>
  )
}

export default IBCBalance

interface IBCBalanceCommonProps {
  coins: Coin[]
  onClickDeposit: () => void
  onClickWithdraw: () => void
}

const IBCBalanceDesktop: React.FC<IBCBalanceCommonProps> = ({
  coins,
  onClickDeposit,
  onClickWithdraw,
}) => {
  const { getIbcSigningClient, ibcSigningClient, isLoadingIbcClientConnection } = useWalletStore()

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
    <tr className="h-[72px]">
      <td>
        <div className="flex items-center gap-x-[10px]  leading-9">
          <img width="32px" height="32px" src="../icons/cosmos.png" alt="" />
          Cosmos Hub - <span className="uppercase">{process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}</span>
        </div>
      </td>
      <td>{getAmountFromDenom(process.env.NEXT_PUBLIC_IBC_DENOM_RAW || 'uatom', coins)}</td>
      <td></td>
      <td>
        <div className="flex gap-x-6">
          <div data-tip="tootlip" data-for={`ibcclient-not-available`}>
            <Button
              size="small"
              type="secondary"
              onClick={onClickDeposit}
              disabled={!ibcSigningClient}
            >
              {isLoadingIbcClientConnection ? <LoadingIcon /> : 'Deposit'}
            </Button>
          </div>
          <div data-tip="tootlip" data-for={`ibcclient-not-available`}>
            <Button
              size="small"
              type="secondary"
              onClick={onClickWithdraw}
              disabled={!ibcSigningClient}
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
      </td>
    </tr>
  )
}

const IBCBalanceMobile: React.FC<IBCBalanceCommonProps> = ({
  coins,
  onClickDeposit,
  onClickWithdraw,
}) => {
  return (
    <div className="flex flex-col rounded-[20px] bg-[#312E5A] bg-opacity-50 p-[20px] ">
      <div className="flex items-center gap-x-[10px]">
        <img width="32px" height="32px" src="../icons/cosmos.png" alt="" />
        <p className="text-xl font-semibold text-white">
          Cosmos Hub - <span className="uppercase">{process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}</span>
        </p>
      </div>
      <p className="mt-[20px] text-left font-semibold text-cosmon-main-tertiary">Balance</p>
      <p className="mt-2 text-left text-xl font-semibold text-white">
        {getAmountFromDenom(process.env.NEXT_PUBLIC_IBC_DENOM_RAW || 'uatom', coins)}
      </p>
      <div className="mt-6 flex justify-center gap-x-6">
        <Button size="small" type="secondary" containerClassname="mx-0" onClick={onClickDeposit}>
          Deposit
        </Button>
        <Button size="small" type="secondary" containerClassname="mx-0" onClick={onClickWithdraw}>
          Withdraw
        </Button>
      </div>
    </div>
  )
}
