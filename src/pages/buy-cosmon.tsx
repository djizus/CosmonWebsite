import { ReactElement } from 'react'
import Layout from '../components/Layout/Layout'
import CommonQuestions from '../sections/CommonQuestions'
import Section from '../components/Section/Section'
import { useWalletStore } from '../store/walletStore'
import ButtonConnectWallet from '@components/Button/ButtonConnectWallet'
import BuyCosmonSection from '@containers/buy-cosmon/components/BuyCosmonSection/BuyCosmonSection'
// import OldBuy from '@containers/buy-cosmon/components/OldBuy/OldBuy'

export default function Page() {
  const { isConnected } = useWalletStore((state) => state)

  return (
    <>
      <div className="mx-auto max-w-[1230px]">
        <Section className="px-[40px] pt-[107px] lg:pt-[160px]">
          <h4 className="mx-auto max-w-[288px] lg:max-w-none">Open a pack, unleash a leader!</h4>
          <p className="mx-auto flex flex-col gap-y-2 pt-[40px] lg:max-w-[880px] lg:pt-[20px]">
            <div>
              Get a vial to mint a random Cosmon from a given rarity level! Each vial will unleash
              one of our 25 Cosmons.
            </div>
            <div>
              The rarer your Cosmons are, the more yield you will get from it. Your Cosmon's initial
              characteristics will also be higher with an upper rarity.{' '}
            </div>
          </p>
        </Section>

        {/* @INFO :  we keep old code to buy a cosmon in case */}
        {/* <OldBuy /> */}

        <BuyCosmonSection />

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
                {!isConnected && <ButtonConnectWallet />}
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
