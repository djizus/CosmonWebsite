import { coin, coins } from '@cosmjs/proto-signing'
import { Transition } from '@headlessui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { CosmonType } from '../../../types/Cosmon'
import { useWalletStore } from '../../store/walletStore'
import { getAmountFromDenom } from '../../utils/index'
import { getScarcityByCosmon } from '../../utils/cosmon'
import Button from '../Button/Button'
import Modal from './Modal'
import { Coin } from '@cosmjs/amino/build/coins'
import BigNumber from "bignumber.js";

type WithdrawDepositModalProps = {
  onCloseModal: () => void
}

export default function WithdrawDepositModal({
  onCloseModal,
}: WithdrawDepositModalProps) {
  const {
    address,
    ibcAddress,
    initIbc,
    coins,
    ibcCoins,
    showWithdrawDepositModal,
  } = useWalletStore((state) => state)

  const [destinationAddress, set_destinationAddress] = useState<string>('')
  const [destinationAddressDebounced] = useDebounce(destinationAddress, 500)
  const [destinationAddressValid, set_destinationAddressValid] = useState(false)
  const [isFetchingInfo, set_isFetchingInfo] = useState<boolean>(false)
  const [amountToTransfer, set_amountToTransfer] = useState<string>()

  const getChainAmount = () => {
    return getAmountFromDenom(
      process.env.NEXT_PUBLIC_STAKING_DENOM || '',
      coins
    )
  }

  const isAmountInvalid = () => {
    if (showWithdrawDepositModal === 'withdraw') {
      return getIbcAmount() < parseFloat(amountToTransfer || '0')
    } else {
      return getFromChainAmount() < parseFloat(amountToTransfer || '0')
    }
  }

  const getIbcAmount = () => {
    return getAmountFromDenom(
      process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '',
      coins
    )
  }

  const getFromChainAmount = () => {
    return getAmountFromDenom(process.env.NEXT_PUBLIC_IBC_DENOM || '', ibcCoins)
  }

  const launchInitIbc = () => {
    const coin: Coin = {
      amount: new BigNumber(amountToTransfer || '0').multipliedBy(1_000_000).toString() ,
      denom:
        showWithdrawDepositModal === 'deposit'
          ? process.env.NEXT_PUBLIC_IBC_DENOM || ''
          : process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '',
    }
    initIbc(coin, showWithdrawDepositModal === 'deposit')
  }

  // const checkIfIsWalletAddressValid = useCallback(async (address) => {
  //   if (signingClient) {
  //     try {
  //       await signingClient.getBalance(address, 'UST')
  //       set_destinationAddressValid(true)
  //     } catch (e) {
  //       set_destinationAddressValid(false)
  //     } finally {
  //       set_isFetchingInfo(false)
  //     }
  //   }
  // }, [])

  // useEffect(() => {
  //   set_destinationAddressValid(false)
  //   if (destinationAddressDebounced.length > 8) {
  //     checkIfIsWalletAddressValid(destinationAddressDebounced)
  //   } else {
  //     set_isFetchingInfo(false)
  //   }
  // }, [destinationAddressDebounced])

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
          <div className="flex gap-x-1 pb-1">
            Available balance:{' '}
            <div className="flex uppercase">
              {showWithdrawDepositModal === 'withdraw' ? (
                <>
                  {getIbcAmount()} {process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}
                </>
              ) : (
                <>
                  {getFromChainAmount()}{' '}
                  {process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}
                </>
              )}
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
                  showWithdrawDepositModal === 'withdraw'
                    ? set_amountToTransfer(getIbcAmount().toString())
                    : set_amountToTransfer(getFromChainAmount().toString())
                }}
                className="h-[28px]"
                size="small"
                type="secondary"
              >
                Max
              </Button>
            </div>
          </div>
          {isAmountInvalid() && (
            <div className="pt-2 text-center font-normal text-[#DF4547]">
              Insufficient amount
            </div>
          )}
        </div>
        <div className="flex w-full justify-center">
          <Button
            isLoading={isFetchingInfo}
            disabled={
              !amountToTransfer || isAmountInvalid() || amountToTransfer === '0'
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
