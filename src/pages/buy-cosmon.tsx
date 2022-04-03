import type { ReactElement } from 'react'
import Layout from '../components/Layout/Layout'
import CommonQuestions from '../sections/CommonQuestions'
import Subscribe from '../sections/Subscribe'
import Section from '../components/Section/Section'
import PotionItem from '../components/PotionItem/PotionItem'
import Button from '../components/Button/Button'
import { useStoreState, useStoreActions } from '../store/hooks'

export default function Page() {
  const isConnected = useStoreState((state) => state.isConnected)
  const walletAction = useStoreActions((thunk) => thunk.walletAction)

  return (
    <>
      <Section className="px-[40px] pt-[107px] lg:pt-[140px]">
        <h4 className="mx-auto max-w-[288px] lg:max-w-none">
          Open a potion, unleash a leader!
        </h4>
        <p className="mx-auto pt-[40px] lg:max-w-4xl lg:pt-[20px]">
          Get a vial to mint a random Cosmon from a given rarity level! Each
          vial will unleash one of our 25 Cosmons.
          <br /> <br />
          The rarer your Cosmons are, the more yield you will get from it. Your
          Cosmon's initial characteristics will also be higher with an upper
          rarity.
        </p>
      </Section>

      <Section className="pt-[72px]">
        {isConnected && (
          <div className="mb-[70px] rounded-[20px] bg-[#312E5A] bg-opacity-50">
            <div className="hidden items-center justify-center py-[24px] lg:flex">
              <p className="px-10 text-[22px] font-semibold leading-[32px] text-white">
                Congrats, you received an airdrop of 3 common Cosmon!
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-y-[60px] lg:grid-cols-4">
          <PotionItem
            type="Uncommon"
            price={'100$'}
            img="uncommon.png"
            isAvailable={true}
          />
          <PotionItem
            type="Rare"
            price={'250$'}
            img="rare.png"
            isAvailable={true}
          />
          <PotionItem
            type="Epic"
            price={'1000$'}
            img="epic.png"
            isAvailable={false}
          />
          <PotionItem
            type="Legendary"
            price={'2500$'}
            img="legendary.png"
            isAvailable={true}
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
                <Button
                  onClick={() =>
                    walletAction({
                      action: 'connect',
                    })
                  }
                  className="max-h-[42px]"
                >
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
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
