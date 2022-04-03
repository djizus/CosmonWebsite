import Button from '../Button/Button'

type WalletPopupProps = {
  onClosePopup: () => void
}

export default function WalletPopup({ onClosePopup }: WalletPopupProps) {
  return (
    <>
      <div
        onClick={onClosePopup}
        className="fixed left-0 top-0 z-[40] h-full w-full bg-[rgba(27,27,27,0.5)]"
      ></div>
      <div className="absolute top-14 right-0 z-[50] w-[327px] rounded-xl border-[0.5px] border-[#A996FF] bg-cosmon-main-secondary p-5">
        <div className="font-[14px]  text-white">
          <div className="font-semibold">Your XKI Breakdown</div>
          <div className="flex flex-col gap-y-1 pt-4">
            <div className="flex justify-between">
              <div> XKI balance </div>
              <div> 147.534 XKI </div>
            </div>
            <div className="flex justify-between">
              <div>XKI to claim</div>
              <div className="flex gap-x-2">
                <div className="font-semibold text-cosmon-main-tertiary">
                  Claim
                </div>
                65.189 XKI
              </div>
            </div>
            <div className="flex justify-between">
              <div> XKI earned </div>
              <div> 7,065.16 XKI </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button size="small" type="ghost">
              Deposit
            </Button>
            <Button size="small" type="ghost">
              Withdraw
            </Button>
          </div>

          <div className="pt-6">
            <Button type="primary" className="max-h-[42px]">
              Prize Pool: $1,000,000.13
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
