import Button from '@components/Button/Button'
import CosmonAcquiredModal from '@components/Modal/CosmonAcquiredModal'
import CosmonAirdropModal from '@components/Modal/CosmonAirdropModal'
import Section from '@components/Section/Section'
import UnmaskOnReach from '@components/UnmaskOnReach/UnmaskOnReach'
import { useAirdropStore } from '@store/airdropStore'
import { useCosmonStore } from '@store/cosmonStore'
import { useWalletStore } from '@store/walletStore'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { CosmonType } from 'types'

interface Props {}

const Airdrop: React.FC<Props> = () => {
  const { getAirdropData, airdropData, resetAirdropData } = useAirdropStore((state) => state)
  const { isConnected } = useWalletStore((state) => state)
  const { whitelistData, isSellOpen, getWhitelistData } = useCosmonStore((state) => state)
  const [cosmonBought, set_cosmonBought] = useState<null | CosmonType>()

  useEffect(() => {
    getWhitelistData()
  }, [isConnected])

  return (
    <>
      {cosmonBought && (
        <CosmonAcquiredModal
          cosmon={cosmonBought}
          actions={
            <div className="flex gap-x-5 pt-[60px] pb-2">
              <Button size="small" onClick={() => router.push('my-assets')}>
                See my assets
              </Button>
            </div>
          }
          onCloseModal={() => set_cosmonBought(null)}
        />
      )}
      {airdropData && <CosmonAirdropModal onCloseModal={() => resetAirdropData()} />}

      <Section className="">
        {isConnected && (
          <div className="flex flex-col gap-y-8">
            <UnmaskOnReach>
              <div className="rounded-[20px] bg-[#312E5A] bg-opacity-50">
                <div className="hidden items-center justify-center py-[24px] lg:flex">
                  <div className="flex items-center gap-x-8 px-10 ">
                    <p className="text-[22px] font-semibold leading-[32px] text-white">
                      Test your eligibility to our Cosmon airdrop!
                    </p>
                    <Button onClick={() => getAirdropData()} size="small">
                      {' '}
                      Check
                    </Button>
                  </div>
                </div>
              </div>
            </UnmaskOnReach>
            {whitelistData && whitelistData.available_slots > whitelistData.used_slots && (
              <div className="rounded-[20px] bg-[#5EC640] bg-opacity-50">
                <div className="hidden items-center justify-center py-[24px] lg:flex">
                  <div className="flex items-center gap-x-8 px-10 ">
                    <p className="text-[22px] font-semibold leading-[32px] text-white">
                      You are on the Whitelist: Benefit from 3 discounted Cosmons!
                    </p>
                    <div className="flex gap-x-3">
                      <div className="pill bg-[#0E9534]">
                        {whitelistData.available_slots - whitelistData.used_slots} mints left
                      </div>
                      <div className="pill bg-[#0E9534]">
                        {whitelistData.discount_percent}% Discount
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {whitelistData && whitelistData.available_slots === 0 && !isSellOpen && (
              <div className="rounded-[20px] bg-[#312E5A] bg-opacity-50">
                <div className="hidden items-center justify-center py-[24px] lg:flex">
                  <div className="flex items-center gap-x-8 px-10 ">
                    <p className="text-[22px] font-normal leading-[32px] text-white">
                      Unfortunatly this wallet is not whitelisted, let’s see you for the{' '}
                      <span className="font-semibold">public sale on 04.07.2022</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
            {whitelistData &&
              whitelistData.available_slots !== 0 &&
              whitelistData.available_slots === whitelistData.used_slots &&
              !isSellOpen && (
                <div className="rounded-[20px] bg-[#312E5A] bg-opacity-50">
                  <div className="hidden items-center justify-center py-[24px] lg:flex">
                    <div className="flex items-center gap-x-8 px-10 ">
                      <p className="text-[22px] font-normal leading-[32px] text-white">
                        All discounted cosmon has been bought, see you for the{' '}
                        <span className="font-semibold">public sale on 04.07.2022</span>
                      </p>
                      <div className="flex min-w-[140px]">
                        <div className="pill bg-[#413673]">0 mint left</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </Section>
    </>
  )
}

Airdrop.displayName = 'Airdrop'

export default Airdrop
