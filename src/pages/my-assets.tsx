import { ReactElement, useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import CommonQuestions from '../sections/CommonQuestions'
import Subscribe from '../sections/Subscribe'
import Section from '../components/Section/Section'
import Image from 'next/image'
import Button from '../components/Button/Button'
import { useWalletStore } from '../store/walletStore'
import { getScarcitiesNumberByCosmons } from '../utils/cosmon'
import { scarcities, Scarcity } from '../../types/Scarcity'
import { CosmonType } from '../../types/Cosmon'

export default function Page() {
  const { connect, isConnected, cosmons, isFetchingData } = useWalletStore(
    (state) => state
  )

  const [scarcitiesNumberByCosmons, set_scarcitiesNumberByCosmons] = useState<
    {
      key: Scarcity
      count: number
    }[]
  >([])

  useEffect(() => {
    if (cosmons.length > 0) {
      set_scarcitiesNumberByCosmons(getScarcitiesNumberByCosmons(cosmons))
    }
  }, [cosmons])

  useEffect(() => {
    console.log('isFetchingCosmonsDetail', isFetchingData)
  }, [isFetchingData])

  return (
    <div className="max-w-auto px-2 pt-[100px] lg:pt-[158px]">
      {!isConnected() ? (
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
      ) : (
        <>
          <div className="mx-auto hidden max-w-[1120px] flex-col rounded-[20px] bg-[#312E5A] bg-opacity-50 p-10 lg:flex">
            <div className="flex">
              <div className="flex items-center text-[22px] font-semibold text-white">
                My Cosmon Assets
                <div className="flex items-center gap-x-4">
                  <img
                    className="ml-8"
                    width="25"
                    height="30"
                    src="/icons/cards.svg"
                    alt="My cosmon assets"
                  />

                  {cosmons.length}
                  <div className="h-8 border border-[#989898]"></div>
                  {scarcities.map((scarcity) => (
                    <div
                      key={scarcity}
                      className="flex items-center gap-x-3 text-[22px]"
                    >
                      <img
                        width={40}
                        height={40}
                        src={`/rarity-levels/${scarcity.toLowerCase()}.png`}
                      />
                      {scarcitiesNumberByCosmons.find(
                        (scarcityCount) => scarcityCount.key === scarcity
                      )?.count || 0}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              gridTemplateColumns:
                'repeat(auto-fit, minmax(167px, max-content))',
            }}
            className="mx-auto mt-40 grid max-w-[1180px] gap-[60px]  px-8"
          >
            {!isFetchingData
              ? cosmons.map((cosmon) => (
                  <div
                    key={cosmon.id}
                    className="flex flex-col items-center gap-y-5"
                  >
                    <img
                      height={280}
                      width={167}
                      src={cosmon.data.extension.image}
                    />
                    <Button type="secondary" size="small">
                      {' '}
                      Transfer{' '}
                    </Button>
                  </div>
                ))
              : Array.from(Array(10).keys()).map((index) => {
                  return (
                    <div
                      key={index}
                      className={`h-[280px] w-[167px] animate-pulse rounded-lg bg-gray-100`}
                    ></div>
                  )
                })}
          </div>
        </>
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
