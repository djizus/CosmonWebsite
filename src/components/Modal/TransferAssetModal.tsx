import { Transition } from '@headlessui/react'
import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { CosmonType } from '../../../types/Cosmon'
import { useWalletStore } from '../../store/walletStore'
import { getScarcityByCosmon } from '../../utils/cosmon'
import Button from '../Button/Button'
import Modal from './Modal'

type TransferAssetModalProps = {
  onCloseModal: () => void
  asset: CosmonType
}

export default function TransferAssetModal({
  onCloseModal,
  asset,
}: TransferAssetModalProps) {
  const { transferAsset, address, signingClient } = useWalletStore(
    (state) => state
  )

  const [destinationAddress, set_destinationAddress] = useState<string>('')
  const [destinationAddressDebounced] = useDebounce(destinationAddress, 500)
  const [destinationAddressValid, set_destinationAddressValid] = useState(false)
  const [isFetchingInfo, set_isFetchingInfo] = useState<boolean>(false)

  const checkIfIsWalletAddressValid = useCallback(async (address) => {
    if (signingClient) {
      try {
        await signingClient.getBalance(address, 'UST')
        set_destinationAddressValid(true)
      } catch (e) {
        set_destinationAddressValid(false)
      } finally {
        set_isFetchingInfo(false)
      }
    }
  }, [])

  useEffect(() => {
    set_destinationAddressValid(false)
    if (destinationAddressDebounced.length > 8) {
      checkIfIsWalletAddressValid(destinationAddressDebounced)
    } else {
      set_isFetchingInfo(false)
    }
  }, [destinationAddressDebounced])

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
      >
        <h3 className="pb-8 text-[22px] "> Cosmon Transfer </h3>

        <div className="mb-9 rounded-[20px] bg-[#312E5A] bg-opacity-50">
          <div className="items-center justify-center py-[24px]">
            <p className="flex items-center gap-x-8 px-10 text-[14px] leading-[18px] text-white">
              Cosmon NFT are only transferable on the Ki chain
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-[16px] ">
          <div>Sending</div>
          <div className="flex items-center gap-x-2">
            {asset.data.extension.name}
            <div className="rounded-lg bg-cosmon-main-primary px-[10px] py-1">
              {getScarcityByCosmon(asset)}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="mb-[60px] flex flex-col gap-y-5">
          <div>
            <div className="mb-1">From </div>
            <input
              className="dark-text w-full"
              type="text"
              disabled={true}
              value={address}
            />
          </div>

          <div>
            <div className="mb-1">To </div>
            <input
              className="dark-text w-full"
              type="text"
              placeholder={'Enter the recipient address'}
              onChange={(e) => {
                set_isFetchingInfo(true)
                set_destinationAddress(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="flex w-full justify-center">
          <Button
            isLoading={isFetchingInfo}
            disabled={!destinationAddressValid}
            onClick={async () => {
              await transferAsset(destinationAddressDebounced, asset)
              onCloseModal()
            }}
          >
            {' '}
            Transfer{' '}
          </Button>
        </div>
      </Transition>
    </Modal>
  )
}
