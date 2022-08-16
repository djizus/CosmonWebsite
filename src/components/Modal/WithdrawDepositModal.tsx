import { Transition } from '@headlessui/react'
import { useMemo, useState } from 'react'
import { useWalletStore } from '../../store/walletStore'
import { getAmountFromDenom } from '../../utils/index'
import Button from '../Button/Button'
import Modal from './Modal'
import { Coin } from '@cosmjs/amino/build/coins'
import BigNumber from 'bignumber.js'
import Tooltip from '@components/Tooltip/Tooltip'

type WithdrawDepositModalProps = {
  onCloseModal: () => void
}

const PUBLIC_IBC_TX_FEES = parseFloat(process.env.NEXT_PUBLIC_IBC_TX_FEES!)

export default function WithdrawDepositModal({
  onCloseModal,
}: WithdrawDepositModalProps) {
  const {
    address,
    ibcAddress,
    initIbc,
    isCurrentlyIbcTransferring,
    coins,
    ibcCoins,
    showWithdrawDepositModal,
  } = useWalletStore((state) => state)

  const [amountToTransfer, set_amountToTransfer] = useState<string>()

  const getIbcAmount = useMemo(() => {
    return getAmountFromDenom(
      process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '',
      coins
    )
  }, [coins])

  const getFromChainAmount = useMemo(() => {
    return getAmountFromDenom(process.env.NEXT_PUBLIC_IBC_DENOM || '', ibcCoins)
  }, [ibcCoins])

  const isAmountInvalid = useMemo(() => {
    if (showWithdrawDepositModal === 'withdraw') {
      return getIbcAmount < parseFloat(amountToTransfer || '0')
    } else {
      return (
        getFromChainAmount - PUBLIC_IBC_TX_FEES <
        parseFloat(amountToTransfer || '0')
      )
    }
  }, [showWithdrawDepositModal, amountToTransfer])

  const launchInitIbc = async () => {
    const coin: Coin = {
      amount: new BigNumber(amountToTransfer || '0')
        .multipliedBy(1_000_000)
        .toString(),
      denom:
        showWithdrawDepositModal === 'deposit'
          ? process.env.NEXT_PUBLIC_IBC_DENOM || ''
          : process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '',
    }
    await initIbc(coin, showWithdrawDepositModal === 'deposit')
    onCloseModal()
  }

  return (
    <Modal onCloseModal={onCloseModal}>
      <Transition
        show={true}
        appear={true}
        enter="transition-opacity duration-[.5s]"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-[.5s]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="min-w-[533px]"
      >
        <h3 className="pb-8 text-[22px] capitalize">
          {' '}
          {showWithdrawDepositModal === 'deposit'
            ? `${process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN} Deposit`
            : `${process.env.NEXT_PUBLIC_DENOM} Withdraw`}
        </h3>

        {/* Inputs */}
        <div className="mb-[36px] flex flex-col gap-y-5">
          <div>
            <div className="mb-1">From </div>
            <input
              className="dark-text w-full"
              type="text"
              disabled={true}
              value={
                showWithdrawDepositModal === 'deposit' ? ibcAddress : address
              }
            />
          </div>

          <div>
            <div className="mb-1">To </div>
            <input
              className="dark-text w-full"
              type="text"
              // placeholder={'Enter the recipient address'}
              disabled={true}
              value={
                showWithdrawDepositModal === 'deposit' ? address : ibcAddress
              }
              // onChange={(e) => {
              //   set_isFetchingInfo(true)
              //   set_destinationAddress(e.target.value)
              // }}
            />
          </div>
        </div>

        <div className="mb-[60px] rounded-[14px] border border-cosmon-main-tertiary p-3">
          <div className="flex justify-between pb-1">
            <div className="flex gap-x-1">
              Available balance:{' '}
              <div className="flex uppercase">
                {showWithdrawDepositModal === 'withdraw' ? (
                  <>
                    {getIbcAmount} {process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}
                  </>
                ) : (
                  <>
                    {getFromChainAmount}{' '}
                    {process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}
                  </>
                )}
              </div>
            </div>
            <div className="flex">
              {showWithdrawDepositModal === 'deposit' ? (
                <>
                  <img
                    src="/icons/info.svg"
                    alt="Deposit info"
                    data-tip="tootlip"
                    data-for={`deposit-info`}
                    className="h-[24px] w-[24px] cursor-help"
                  />
                  <Tooltip id={`deposit-info`} place="top">
                    <p style={{ whiteSpace: 'pre' }}>
                      The maximum deposit corresponds to your ATOM balance minus
                      {'\n'}
                      <strong>
                        {PUBLIC_IBC_TX_FEES}{' '}
                        {process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN?.toUpperCase()}
                      </strong>{' '}
                      to guarantee the fulfillment of the transaction fee
                    </p>
                  </Tooltip>
                </>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <input
              className="dark-text amount m-0 w-full appearance-none text-right"
              type="text"
              pattern="[0-9]+([\.][0-9]{1,2})?"
              placeholder={'100'}
              onChange={(e) => {
                set_amountToTransfer(e.target.value)
              }}
              value={amountToTransfer || ''}
            />
            <div className="absolute top-[19px] right-[15px]">
              <Button
                onClick={() => {
                  console.log(getFromChainAmount)
                  showWithdrawDepositModal === 'withdraw'
                    ? set_amountToTransfer(getIbcAmount.toString())
                    : set_amountToTransfer(
                        (getFromChainAmount - PUBLIC_IBC_TX_FEES).toString() // we remove 0.1 for the transaction fees
                      )
                }}
                className="h-[28px]"
                size="small"
                type="secondary"
              >
                Max
              </Button>
            </div>
          </div>
          {isAmountInvalid && (
            <div className="pt-2 text-center font-normal text-[#DF4547]">
              Insufficient amount
            </div>
          )}
        </div>
        <div className="flex w-full justify-center">
          <Button
            isLoading={isCurrentlyIbcTransferring}
            disabled={
              !amountToTransfer ||
              isAmountInvalid ||
              amountToTransfer === '0' ||
              isCurrentlyIbcTransferring
            }
            onClick={launchInitIbc}
          >
            <span className="capitalize">{showWithdrawDepositModal}</span>
          </Button>
        </div>
      </Transition>
    </Modal>
  )
}
