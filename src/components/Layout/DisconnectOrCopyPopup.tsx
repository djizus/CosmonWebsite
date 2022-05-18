import { useWalletStore } from '../../store/walletStore'
import { RiFileCopy2Line } from 'react-icons/ri'
import Button from '../Button/Button'

type DisconnectOrCopyPopupProps = {
  onClosePopup: () => void
}

export default function DisconnectOrCopyPopup({
  onClosePopup,
}: DisconnectOrCopyPopupProps) {
  const { address: walletAddress, disconnect } = useWalletStore(
    (state) => state
  )

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      console.log('Text copied to clipboard...')
    })
  }
  return (
    <>
      <div
        onClick={onClosePopup}
        className="fixed left-0 top-0 z-[40] h-full w-full bg-[rgba(27,27,27,0.5)]"
      ></div>
      <div className="absolute top-14 right-0 z-[50] flex w-full flex-col gap-y-4 rounded-xl border-[0.5px] border-[#A996FF] border-opacity-50 bg-cosmon-main-secondary p-4">
        <div
          onClick={() => copyAddressToClipboard()}
          className="flex cursor-pointer items-center gap-x-2 text-sm"
        >
          <RiFileCopy2Line className="h-5 w-5" />
          Copy address
        </div>

        <Button onClick={() => disconnect()} size="small" type="ghost">
          Disconnect
        </Button>
      </div>
    </>
  )
}
