import { useState } from 'react'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import { Transition } from '@headlessui/react'
import { useWalletStore } from '@store/walletStore'
import { CosmonType } from 'types'
import CosmonFullModal from '@components/Modal/CosmonFullModal'
import TransferAssetModal from '@components/Modal/TransferAssetModal'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import Section from '@components/Section/Section'
import CommonQuestions from '@sections/CommonQuestions'
import Subscribe from '@sections/Subscribe'
import ScarcityFilter from './components/ScarcityFilter'
import AssetsBalance from './components/AssetsBalance/AssetsBalance'
import { isMobile } from '@utils/browser'
import CosmonsList from './components/CosmonsList/CosmonsList'

interface MyAssetsProps {}

const MyAssets: React.FC<MyAssetsProps> = ({}) => {
  const { cosmons } = useWalletStore()
  const [assetToTransfer, set_assetToTransfer] = useState<null | CosmonType>()
  const [showCosmonDetail, set_showCosmonDetail] = useState<CosmonType | null>()

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
        />
      )}
      <div className="max-w-auto px-[20px] pt-[100px] lg:px-2 lg:pt-[158px]">
        <ConnectionNeededContent>
          <div className="mx-auto max-w-[1120px] flex-col rounded-[20px] bg-[#312E5A] bg-opacity-50 p-[20px] md:p-10 lg:flex">
            <ScarcityFilter />
            {!isMobile() ? <AssetsBalance /> : null}
          </div>

          {isMobile() ? <AssetsBalance /> : null}

          <CosmonsList
            cosmons={cosmons}
            onClickShowDetails={set_showCosmonDetail}
            onClickTransfer={set_assetToTransfer}
          />
        </ConnectionNeededContent>

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

export default MyAssets
