import { ReactElement, useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import CommonQuestions from '../sections/CommonQuestions'
import Subscribe from '../sections/Subscribe'
import Section from '../components/Section/Section'
import PotionItem from '../components/PotionItem/PotionItem'
import Button from '../components/Button/Button'
import { Scarcity } from '../../types/Scarcity'
import { useWalletStore } from '../store/walletStore'
import useWindowSize from 'react-use/lib/useWindowSize'
import { CosmonType } from '../../types/Cosmon'
import CosmonAcquiredModal from '../components/Modal/CosmonAcquiredModal'
import CosmonAirdropModal from '../components/Modal/CosmonAirdropModal'
import { useRouter } from 'next/router'
import { useAirdropStore } from '../store/airdropStore'

export default function Page() {
  const { buyCosmon, isConnected, connect } = useWalletStore((state) => state)

  const { getAirdropData, airdropData, resetAirdropData } = useAirdropStore(
    (state) => state
  )

  const [isCurrentlyBuying, set_isCurrentlyBuying] = useState<Scarcity | null>(
    null
  )

  const [showCosmonAirdropModal, set_showCosmonAirdropModal] = useState(false)
  const [cosmonBought, set_cosmonBought] = useState<null | CosmonType>()
  const router = useRouter()

  const buy = async (scarcity: Scarcity) => {
    set_isCurrentlyBuying(scarcity)
    try {
      set_cosmonBought(await buyCosmon(scarcity))
    } catch (e: any) {
      console.log('Error! ', e)
    } finally {
      set_isCurrentlyBuying(null)
    }
  }

  useEffect(() => {
    if (cosmonBought) {
      console.log('cosmonBought', cosmonBought)
    }
  }, [cosmonBought])

  useEffect(() => {
    if (airdropData !== undefined) {
      set_showCosmonAirdropModal(true)
    }
  }, [airdropData])

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

      {airdropData && (
        <CosmonAirdropModal onCloseModal={() => resetAirdropData()} />
      )}

      <div className="mx-auto max-w-[1120px]">
        <Section className="px-[40px] pt-[107px] lg:pt-[160px]">
          <h4 className="mx-auto max-w-[288px] lg:max-w-none">
            Open a potion, unleash a leader!
          </h4>
          <p className="mx-auto flex flex-col gap-y-2 pt-[40px] lg:max-w-[880px] lg:pt-[20px]">
            <div>
              Get a vial to mint a random Cosmon from a given rarity level! Each
              vial will unleash one of our 25 Cosmons.
            </div>
            <div>
              The rarer your Cosmons are, the more yield you will get from it.
              Your Cosmon's initial characteristics will also be higher with an
              upper rarity.{' '}
              <span className="font-semibold">
                {' '}
                Public sale planned on the July 4th.
              </span>
            </div>
          </p>
        </Section>

        <Section className=" pt-[72px]">
          {/* {isConnected && (
            <div className="mb-[70px] rounded-[20px] bg-[#312E5A] bg-opacity-50">
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
          )} */}

          <div className="mb-[70px] rounded-[20px] bg-[#5EC640] bg-opacity-50">
            <div className="hidden items-center justify-center py-[24px] lg:flex">
              <div className="flex items-center gap-x-8 px-10 ">
                <p className="text-[22px] font-semibold leading-[32px] text-white">
                  Congrats, you’re eligible to 3 discounted Cosmons!
                </p>
                <div className="flex gap-x-3">
                  <div className="pill bg-[#0E9534]">3 mints left</div>
                  <div className="pill bg-[#0E9534]">15% Discount</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-[60px] lg:grid-cols-4">
            {/* {scarcities.map((scarcity) => (
            <PotionItem
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

            <PotionItem
              buy={() => buy('Common')}
              yieldPercent={process.env.NEXT_PUBLIC_YIELD_UNCOMMON || 'xx'}
              isCurrentlyBuying={isCurrentlyBuying === 'Common'}
              type="Uncommon"
              price={'10 ATOM'}
              img="uncommon.png"
            />
            <PotionItem
              buy={() => buy('Rare')}
              yieldPercent={process.env.NEXT_PUBLIC_YIELD_RARE || 'xx'}
              isCurrentlyBuying={isCurrentlyBuying === 'Rare'}
              type="Rare"
              price={'25 ATOM'}
              img="rare.png"
            />
            <PotionItem
              buy={() => buy('Epic')}
              yieldPercent={process.env.NEXT_PUBLIC_YIELD_EPIC || 'xx'}
              isCurrentlyBuying={isCurrentlyBuying === 'Epic'}
              type="Epic"
              price={'100 ATOM'}
              img="epic.png"
            />
            <PotionItem
              buy={() => buy('Legendary')}
              yieldPercent={process.env.NEXT_PUBLIC_YIELD_LEGENDARY || 'xx'}
              isCurrentlyBuying={isCurrentlyBuying === 'Legendary'}
              type="Legendary"
              price={'250 ATOM'}
              img="legendary.png"
            />
          </div>

          <p className="mt-[68px] text-center text-base">
            *Returns shown represent past performances, and are not guarantees
            of future performances.
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
