import CollectEmail from '@sections/CollectEmail'
import { useWalletStore } from '../../store/walletStore'
import Button from '../Button/Button'

type DisconnectOrCopyPopupProps = {
  onClosePopup: () => void
}

export default function DisconnectOrCopyPopup({ onClosePopup }: DisconnectOrCopyPopupProps) {
  const { address: walletAddress, disconnect, connectedWith } = useWalletStore((state) => state)

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {})
  }

  return (
    <>
      <div
        onClick={onClosePopup}
        className="fixed left-0 top-0 z-[40] h-full w-full bg-[rgba(27,27,27,0.5)]"
      ></div>
      <div className="absolute top-14 right-0 z-[50] flex w-fit flex-col gap-y-2 rounded-xl border-[0.5px] border-[#A996FF] border-opacity-50 bg-cosmon-main-secondary p-4 lg:w-[415px] lg:p-5 ">
        <div
          // onClick={() => copyAddressToClipboard()}
          className="flex cursor-pointer items-center gap-x-2 text-sm lg:text-lg"
        >
          {/* <RiFileCopy2Line className="h-5 w-5" /> */}
          Account
        </div>

        <div className="m-1 flex justify-between text-[#D1D2D8]">
          <p className="lg:text-md text-sm">Your Address</p>
          <div className="lg:text-md text-sm font-normal">Connected with {connectedWith}</div>
        </div>

        <div
          onClick={() => copyAddressToClipboard()}
          className=" group mb-4 flex cursor-pointer items-center justify-between gap-x-4 rounded-2xl border border-[#413673] bg-[#0D0531] px-3 py-4  text-xs active:opacity-40 lg:py-[17px] lg:px-6"
        >
          <span className="font-normal">{walletAddress}</span>
          <img className="" src="../icons/copy-link.svg" alt="" />
        </div>

        <div className="flex flex-col items-start">
          <p className="lg:text-md text-sm text-[#D1D2D8]">Stay connected to community</p>
          <div className="mt-[10px] mb-[20px] w-full">
            <CollectEmail />
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            onClick={() =>
              window.open(`https://www.mintscan.io/ki-chain/account/${walletAddress}`, '_blank')
            }
            size="small"
            type="secondary"
            containerClassname="mx-0"
          >
            Go Mintscan <img src="../icons/link.svg" />
          </Button>
          <Button
            onClick={() => disconnect()}
            size="small"
            type="secondary"
            containerClassname="mx-0"
          >
            Disconnect
          </Button>
        </div>
      </div>
    </>
  )
}
