import { ReactElement } from 'react'
import Layout from '../components/Layout/Layout'
import CommonQuestions from '../sections/CommonQuestions'
import Section from '../components/Section/Section'
import { useWalletStore } from '../store/walletStore'
import ButtonConnectWallet from '@components/Button/ButtonConnectWallet'
import BuyCosmonSection from '@containers/buy-cosmon/components/BuyCosmonSection/BuyCosmonSection'
import Airdrop from '@containers/buy-cosmon/components/Airdrop/Airdrop'
// import OldBuy from '@containers/buy-cosmon/components/OldBuy/OldBuy'

export default function Page() {
  const { isConnected } = useWalletStore((state) => state)

  return (
    <>
      <div className="mx-auto max-w-[1230px]">
        <Section className=" px-[40px] pt-[107px] lg:pt-[160px]">
          <Airdrop />
          <h4 className="mx-auto mb-[69px] max-w-[288px] pt-[73px] lg:max-w-none">
            Start the adventure, get a ready-to-play
            <br />
            deck ...
          </h4>
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
