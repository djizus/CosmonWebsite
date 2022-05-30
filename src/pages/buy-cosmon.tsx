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
import Confetti from 'react-confetti'
import { CosmonType } from '../../types/Cosmon'
import ShowCosmonBoughtModal from '../components/Modal/CosmonBoughtModal'
import CosmonAirdropModal from '../components/Modal/CosmonAirdropModal'

export default function Page() {
  const { buyCosmon, isConnected, connect } = useWalletStore((state) => state)
  const [isCurrentlyBuying, set_isCurrentlyBuying] = useState<Scarcity | null>(
    null
  )

  const [dropConfetti, set_dropConfetti] = useState(false)
  const [cosmonBought, set_cosmonBought] = useState<null | CosmonType>()
  const { width, height } = useWindowSize()

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

  return (
    <>
      {cosmonBought && (
        <ShowCosmonBoughtModal
          cosmon={cosmonBought}
          onCloseModal={() => set_cosmonBought(null)}
        />
      )}

      {/* {<CosmonAirdropModal onCloseModal={() => console.log('siii')} />} */}

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
              upper rarity.
            </div>
          </p>
        </Section>

        <Section className=" pt-[72px]">
          {isConnected && (
            // Cosmon AIRDROP SECTION
            // <div className="mb-[70px] rounded-[20px] bg-[#312E5A] bg-opacity-50">
            //   <div className="hidden items-center justify-center py-[24px] lg:flex">
            //     <div className="flex items-center gap-x-8 px-10 ">
            //       <p className="text-[22px] font-semibold leading-[32px] text-white">
            //         Test your eligibility to our Cosmon airdrop!
            //       </p>
            //       <Button size="small"> Check</Button>
            //     </div>
            //   </div>
            // </div>

            <div className="mb-[70px] rounded-[20px] bg-[#312E5A] bg-opacity-50">
              <div className="hidden items-center justify-center py-[24px] lg:flex">
                <div className="flex items-center gap-x-8 px-10 ">
                  <p className="text-[22px] font-semibold leading-[32px] text-white">
                    Congrats, you’re eligible to 3 discounted Cosmons!
                  </p>
                  <Button className="h-[34px]" size="small">
                    {' '}
                    3 mints left
                  </Button>
                </div>
              </div>
            </div>
          )}
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
              isCurrentlyBuying={isCurrentlyBuying === 'Common'}
              type="Uncommon"
              price={'10 ATOM'}
              img="uncommon.png"
            />
            <PotionItem
              buy={() => buy('Rare')}
              isCurrentlyBuying={isCurrentlyBuying === 'Rare'}
              type="Rare"
              price={'25 ATOM'}
              img="rare.png"
            />
            <PotionItem
              buy={() => buy('Epic')}
              isCurrentlyBuying={isCurrentlyBuying === 'Epic'}
              type="Epic"
              price={'100 ATOM'}
              img="epic.png"
            />
            <PotionItem
              buy={() => buy('Legendary')}
              isCurrentlyBuying={isCurrentlyBuying === 'Legendary'}
              type="Legendary"
              price={'250 ATOM'}
              img="legendary.png"
            />
          </div>
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

        <Section className="pt-36 lg:pt-[261px]">
          <CommonQuestions />
        </Section>

        <Section className="pt-48 pb-44 lg:pt-[298px]">
          <Subscribe />
        </Section>
      </div>
      {dropConfetti && (
        <Confetti
          numberOfPieces={1450}
          tweenDuration={16000}
          recycle={false}
          width={width}
          height={height}
        />
      )}
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
