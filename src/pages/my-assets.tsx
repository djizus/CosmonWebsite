import { ReactElement, ReactEventHandler, useEffect, useState } from 'react'
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
import TransferAssetModal from '../components/Modal/TransferAssetModal'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import { Transition } from '@headlessui/react'
import CosmonFullModal from '../components/Modal/CosmonFullModal'
import { getAmountFromDenom } from '../utils/index'
import { useRewardStore } from '../store/rewardStore'

export default function Page() {
  const { connect, isConnected, cosmons, coins, setShowWithdrawDepositModal } =
    useWalletStore((state) => state)

  const { rewardsData, claimRewards } = useRewardStore((state) => state)

  const [assetToTransfer, set_assetToTransfer] = useState<null | CosmonType>()

  const [scarcitiesNumberByCosmons, set_scarcitiesNumberByCosmons] = useState<
    {
      key: Scarcity
      count: number
    }[]
  >([])

  const [showCosmonDetail, set_showCosmonDetail] = useState<CosmonType | null>()

  useEffect(() => {
    if (cosmons.length > 0) {
      set_scarcitiesNumberByCosmons(getScarcitiesNumberByCosmons(cosmons))
    }
  }, [cosmons])

  return (
    <>
      <Transition
        show={showCosmonDetail !== null}
        className="relative z-[1000]"
        enter="transition-opacity duration-[.5s]"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-[.5s]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {showCosmonDetail && (
          <CosmonFullModal
            onCloseModal={() => set_showCosmonDetail(null)}
            cosmon={showCosmonDetail && showCosmonDetail}
          />
        )}
      </Transition>
      {assetToTransfer && (
        <TransferAssetModal
          asset={assetToTransfer}
          onCloseModal={() => set_assetToTransfer(null)}
        ></TransferAssetModal>
      )}
      <div className="max-w-auto px-2 pt-[100px] lg:pt-[158px]">
        {!isConnected ? (
          <div className="relative flex h-[500px] w-full items-center justify-center">
            <Image
              objectFit="fill"
              layout="fill"
              src="../blurry-bg-connect-wallet.png"
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
              <table className="mt-12  font-semibold">
                <thead className="border-b border-cosmon-main-primary leading-[80px]">
                  <th className="text-left text-cosmon-main-tertiary">
                    Assets
                  </th>
                  <th className="text-left text-cosmon-main-tertiary">
                    Balance
                  </th>
                  <th></th>
                  <th className="w-[261px] text-left text-cosmon-main-tertiary">
                    Actions
                  </th>
                </thead>
                <tbody className="text-xl text-white">
                  <tr className="h-4"></tr>
                  <tr className="h-[72px]">
                    <td>
                      <div className="flex items-center gap-x-[10px]  leading-9">
                        <img
                          width="32px"
                          height="32px"
                          src="../icons/xki.png"
                          alt=""
                        />
                        Ki - XKI
                      </div>
                    </td>
                    <td>
                      {getAmountFromDenom(
                        process.env.NEXT_PUBLIC_STAKING_DENOM || '',
                        coins
                      )}
                    </td>
                    <td
                      // style={{
                      //   textAlign: '-webkit-right',
                      // }}

                      className="mr-8 text-right"
                    >
                      <div className="mr-8 flex justify-end"></div>
                    </td>
                    <td>
                      <div className="flex gap-x-3">
                        <Button
                          onClick={claimRewards}
                          type="primary"
                          size="small"
                          className="text-sm"
                        >
                          Claim rewards
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="h-[72px]">
                    <td>
                      <div className="flex items-center gap-x-[10px]  leading-9">
                        <img
                          width="32px"
                          height="32px"
                          src="../icons/cosmos.png"
                          alt=""
                        />
                        Cosmos Hub -{' '}
                        <span className="uppercase">
                          {process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}
                        </span>
                      </div>
                    </td>
                    <td>
                      {' '}
                      {getAmountFromDenom(
                        process.env.NEXT_PUBLIC_IBC_DENOM_RAW || 'uatom',
                        coins
                      )}
                    </td>
                    <td></td>
                    <td>
                      <div className="flex gap-x-3">
                        <Button
                          size="small"
                          onClick={() => setShowWithdrawDepositModal('deposit')}
                        >
                          Deposit
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            setShowWithdrawDepositModal('withdraw')
                          }
                        >
                          Withdraw
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Transition show={true} appear={true}>
              <div
                style={{
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(167px, max-content))',
                }}
                className="mx-auto mt-40 grid max-w-[1180px] gap-[60px]  px-8"
              >
                {cosmons.map((cosmon) => (
                  <div
                    key={cosmon.id}
                    className="group  transition-all hover:scale-[104%] hover:shadow-2xl"
                  >
                    <div
                      onClick={() => {
                        set_assetToTransfer(cosmon)
                      }}
                      className="transfer-card-icon absolute -top-4 -right-4 z-30 scale-0 rounded-full p-2 transition-all group-hover:scale-100"
                    >
                      <img
                        width="16px"
                        height="16px"
                        src="../icons/transfer-card.svg"
                        alt=""
                      />
                    </div>
                    <Image
                      src={cosmon.data.extension.image}
                      onClick={() => set_showCosmonDetail(cosmon)}
                      height={280}
                      width={167}
                      placeholder="blur"
                      blurDataURL="/cosmon-placeholder.svg"
                    />
                  </div>
                  // </Transition.Child>
                ))}
              </div>
            </Transition>
          </>
        )}

        <Section className="hidden pt-[173px] pb-[162px] lg:flex">
          <CommonQuestions />
        </Section>

        <Section className="pt-48 pb-44 lg:hidden lg:pt-[298px]">
          <Subscribe />
        </Section>
      </div>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
