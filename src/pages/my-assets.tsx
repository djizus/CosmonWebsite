import type { ReactElement } from 'react'
import Layout from '../components/Layout/Layout'
import CommonQuestions from '../sections/CommonQuestions'
import Subscribe from '../sections/Subscribe'
import Section from '../components/Section/Section'
import Image from 'next/image'
import Button from '../components/Button/Button'
import { useWalletStore } from '../store/walletStore'

export default function Page() {
  const { connect, isConnected } = useWalletStore((state) => state)

  return (
    <div className="max-w-auto px-2 pt-[100px] lg:pt-[158px]">
      {!isConnected() && (
        <div className="relative flex h-[500px] w-full items-center justify-center">
          <Image
            objectFit="fill"
            layout="fill"
            src="/blurry-bg-connect-wallet.png"
          ></Image>

          <div className="relative px-6">
            <p className="rounded-[20px] bg-[#312E5A] bg-opacity-50 px-6 py-10 text-[22px] font-semibold leading-8 text-white lg:hidden">
              Go to the desktop version to see your Cosmon assets
            </p>
            <div className="hidden items-center justify-center py-[24px] lg:flex">
              <p className="px-10 text-[22px] font-semibold leading-[32px] text-white">
                Connect your wallet to see your assets
              </p>
              <Button onClick={connect} className="max-h-[42px]">
                Connect Wallet{' '}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Section className="hidden pt-[173px] pb-[162px] lg:flex">
        <CommonQuestions />
      </Section>

      <Section className="pt-48 pb-44 lg:hidden lg:pt-[298px]">
        <Subscribe />
      </Section>
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
