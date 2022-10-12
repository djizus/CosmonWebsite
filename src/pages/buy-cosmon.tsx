import { ReactElement, useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import CommonQuestions from '../sections/CommonQuestions'
import Section from '../components/Section/Section'
import BuyableCard from '../components/BuyableCard/BuyableCard'
import Button from '../components/Button/Button'
import { SCARCITIES, Scarcity } from '../../types/Scarcity'
import { useWalletStore } from '../store/walletStore'
import { CosmonType } from '../../types/Cosmon'
import CosmonAcquiredModal from '../components/Modal/CosmonAcquiredModal'
import CosmonAirdropModal from '../components/Modal/CosmonAirdropModal'
import { useRouter } from 'next/router'
import { useAirdropStore } from '../store/airdropStore'
import { useCosmonStore } from '../store/cosmonStore'
import UnmaskOnReach from '@components/UnmaskOnReach/UnmaskOnReach'
import { AnimationType } from '@components/UnmaskOnReach/UnmaskOnReach.types'
import { motion } from 'framer-motion'

export default function Page() {
  const { buyCosmon, isConnected, connect, address } = useWalletStore((state) => state)

  const { getAirdropData, airdropData, resetAirdropData } = useAirdropStore((state) => state)

  const { getWhitelistData } = useCosmonStore((state) => state)

  const { whitelistData, isSellOpen } = useCosmonStore((state) => state)

  const [isCurrentlyBuying, set_isCurrentlyBuying] = useState<Scarcity | null>(null)

  const [cosmonPrices, set_cosmonPrices] = useState<
    {
      scarcity: Scarcity
      amount: string
    }[]
  >()

  const [showCosmonAirdropModal, set_showCosmonAirdropModal] = useState(false)
  const [cosmonBought, set_cosmonBought] = useState<null | CosmonType>()
  const router = useRouter()

  const buy = async (scarcity: Scarcity, price: string) => {
    set_isCurrentlyBuying(scarcity)
    try {
      set_cosmonBought(await buyCosmon(scarcity, price))
      getWhitelistData()
    } catch (e: any) {
      console.log('Error! ', e)
    } finally {
      set_isCurrentlyBuying(null)
    }
  }

  useEffect(() => {
    if (cosmonBought) {
    }
  }, [cosmonBought])

  useEffect(() => {
    if (airdropData !== undefined) {
      set_showCosmonAirdropModal(true)
    }
  }, [airdropData])

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

      <div className="mx-auto max-w-[1230px]">
        <Section className="px-[40px] pt-[107px] lg:pt-[160px]">
          <h4 className="mx-auto max-w-[288px] lg:max-w-none">
            Get your Leader to join the fight!
          </h4>
          <p className="mx-auto flex flex-col gap-y-2 pt-[40px] lg:max-w-[880px] lg:pt-[20px]">
            <div>
              Get a vial to mint a random Cosmon from a given rarity level! Each vial will unleash
              one of our 25 Cosmons.
            </div>
            <div>
              The rarer your Cosmons are, the more yield you will get from it. Your Cosmon's initial
              characteristics will also be higher with an upper rarity.{' '}
              <span className="font-semibold"> Public sale planned on the July 4th.</span>
            </div>
          </p>
        </Section>

        <Section className=" pt-[72px]">
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

          <div className="mt-20 grid grid-cols-2 gap-y-[60px] lg:grid-cols-5">
            {/* {scarcities.map((scarcity) => (
            <BuyableCard
              buy={() => buy(scarcity)}
              isCurrentlyBuying={isCurrentlyBuying === scarcity}
              type={scarcity}
              price={'?'}
              img={`${scarcity}.png`}
              isAvailable={
                (scarcitiesAvailable.find((data) => data.scarcity === scarcity)
                  ?.count || 0) > 0
              }
            />
          ))} */}
            <UnmaskOnReach delay={0.2}>
              <BuyableCard
                buy={(price: string) => buy(SCARCITIES.COMMON, price)}
                yieldPercent={
                  (process.env.NEXT_PUBLIC_YIELD_COMMON !== undefined &&
                    process.env.NEXT_PUBLIC_YIELD_COMMON) ||
                  'xx'
                }
                isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.COMMON}
                type={SCARCITIES.COMMON}
                img="common.svg"
              />
            </UnmaskOnReach>
            <UnmaskOnReach delay={0.2}>
              <BuyableCard
                buy={(price: string) => buy(SCARCITIES.UNCOMMON, price)}
                yieldPercent={process.env.NEXT_PUBLIC_YIELD_UNCOMMON || 'xx'}
                isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.UNCOMMON}
                type={SCARCITIES.UNCOMMON}
                img="uncommon.svg"
              />
            </UnmaskOnReach>
            <UnmaskOnReach delay={0.4}>
              <BuyableCard
                buy={(price) => buy(SCARCITIES.RARE, price)}
                yieldPercent={process.env.NEXT_PUBLIC_YIELD_RARE || 'xx'}
                isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.RARE}
                type={SCARCITIES.RARE}
                img="rare.svg"
              />
            </UnmaskOnReach>
            <UnmaskOnReach delay={0.6}>
              <BuyableCard
                buy={(price) => buy(SCARCITIES.EPIC, price)}
                yieldPercent={process.env.NEXT_PUBLIC_YIELD_EPIC || 'xx'}
                isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.EPIC}
                type={SCARCITIES.EPIC}
                img="epic.svg"
              />
            </UnmaskOnReach>
            <UnmaskOnReach delay={0.8}>
              <BuyableCard
                buy={(price) => buy(SCARCITIES.LEGENDARY, price)}
                yieldPercent={process.env.NEXT_PUBLIC_YIELD_LEGENDARY || 'xx'}
                isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.LEGENDARY}
                type={SCARCITIES.LEGENDARY}
                img="legendary.svg"
              />
            </UnmaskOnReach>
          </div>

          <p className="mt-[68px] text-center text-base">
            *Returns shown represent past performances, and are not guarantees of future
            performances.
          </p>
        </Section>

        <Section className="pt-20 lg:pt-[42px] ">
          <div className="rounded-[20px] bg-[#312E5A] bg-opacity-50">
            <p className="px-10 py-6 text-[22px] font-semibold leading-[32px] text-white lg:hidden">
              Go to the desktop version to buy Cosmon
            </p>

            {!isConnected && (
              <div className="hidden items-center justify-center py-[24px] lg:flex">
                <p className="px-10 text-[22px] font-semibold leading-[32px] text-white">
                  Connect your wallet to buy Cosmon
                </p>
                {!isConnected && (
                  <Button onClick={connect} className="max-h-[42px]">
                    Connect Wallet{' '}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Section>

        <Section className="pt-36 pb-[100px] lg:pt-[120px] lg:pb-[200px]">
          <CommonQuestions />
        </Section>

        {/* <Section className="pt-48 pb-44 lg:pt-[298px]">
          <Subscribe />
        </Section> */}
      </div>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
