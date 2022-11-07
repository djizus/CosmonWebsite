import Button from '@components/Button/Button'
import { Coin } from '@cosmjs/proto-signing'
import { useRewardStore } from '@store/rewardStore'
import { useWalletStore } from '@store/walletStore'
import { getAmountFromDenom } from '@utils'
import { isMobile } from '@utils/browser'
import React, { useMemo } from 'react'

interface XKIBalanceProps {}

const XKIBalance: React.FC<XKIBalanceProps> = ({}) => {
  const { rewardsData, claimRewards } = useRewardStore()
  const { coins } = useWalletStore()

  const hasRewards = useMemo(() => {
    if (rewardsData && +rewardsData.current.amount !== 0) {
      return true
    }
    return false
  }, [rewardsData?.current])

  return (
    <>
      {isMobile() ? (
        <XKIBalanceMobile hasRewards={hasRewards} coins={coins} onClickClaim={claimRewards} />
      ) : (
        <XKIBalanceDesktop hasRewards={hasRewards} coins={coins} onClickClaim={claimRewards} />
      )}
    </>
  )
}

export default XKIBalance

interface XKIBalanceCommonProps {
  hasRewards: boolean
  coins: Coin[]
  onClickClaim: () => void
}

const XKIBalanceDesktop: React.FC<XKIBalanceCommonProps> = ({
  coins,
  hasRewards,
  onClickClaim,
}) => {
  return (
    <tr className="h-[72px]">
      <td>
        <div className="flex items-center gap-x-[10px] leading-9">
          <img width="32px" height="32px" src="../icons/xki.png" alt="" />
          Ki - XKI
        </div>
      </td>
      <td>{getAmountFromDenom(process.env.NEXT_PUBLIC_STAKING_DENOM || '', coins)}</td>
      <td className="mr-8 text-right">
        <div className="mr-8 flex justify-end"></div>
      </td>
      <td>
        <Button
          onClick={() => {
            hasRewards && onClickClaim()
          }}
          type={hasRewards ? 'primary' : 'disabledColored'}
          size="small"
          className="text-sm"
          containerClassname="mx-0"
        >
          {hasRewards ? 'Claim rewards' : 'No rewards to claim'}
        </Button>
      </td>
    </tr>
  )
}

const XKIBalanceMobile: React.FC<XKIBalanceCommonProps> = ({ coins, hasRewards, onClickClaim }) => {
  return (
    <div className="flex flex-col rounded-[20px] bg-[#312E5A] bg-opacity-50 p-[20px] ">
      <div className="flex items-center gap-x-[10px]">
        <img width="32px" height="32px" src="../icons/xki.png" alt="" />
        <p className="text-xl font-semibold text-white"> Ki - XKI</p>
      </div>
      <p className="mt-[20px] text-left font-semibold text-cosmon-main-tertiary">Balance</p>
      <p className="mt-2 text-left text-xl font-semibold text-white">
        {getAmountFromDenom(process.env.NEXT_PUBLIC_STAKING_DENOM || '', coins)}
      </p>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={() => {
            hasRewards && onClickClaim()
          }}
          type={hasRewards ? 'primary' : 'disabledColored'}
          size="small"
          className="text-sm"
        >
          {hasRewards ? 'Claim rewards' : 'No rewards to claim'}
        </Button>
      </div>
    </div>
  )
}
