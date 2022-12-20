import { useMemo, useState } from 'react'
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
import Button from '@components/Button/Button'
import clsx from 'clsx'
import * as style from './style.module.scss'

interface MyAssetsProps {}

export type CosmonsListType = 'all' | 'enrolled' | 'listed' | 'available'

const MyAssets: React.FC<MyAssetsProps> = ({}) => {
  const { cosmons } = useWalletStore()
  const [assetToTransfer, set_assetToTransfer] = useState<null | CosmonType>()
  const [showCosmonDetail, set_showCosmonDetail] = useState<CosmonType | null>()
  const [currentSection, setCurrentSection] = useState<CosmonsListType>('all')

  const availableCosmons = useMemo(() => {
    return cosmons.filter((cosmon) => !cosmon.isListed && !cosmon.isInDeck)
  }, [cosmons])

  const enrolledCosmons = useMemo(() => {
    return cosmons.filter((cosmon) => cosmon.isInDeck)
  }, [cosmons])

  const listedCosmons = useMemo(() => {
    return cosmons.filter((cosmon) => cosmon.isListed)
  }, [cosmons])

  const filtredCosmons = useMemo(() => {
    switch (currentSection) {
      case 'all': {
        return cosmons
      }

      case 'available': {
        return availableCosmons
      }

      case 'enrolled': {
        return enrolledCosmons
      }

      case 'listed': {
        return listedCosmons
      }

      default: {
        return cosmons
      }
    }
  }, [cosmons, enrolledCosmons, currentSection])

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
            cosmon={showCosmonDetail && { ...showCosmonDetail, boosts: [null, null, null] }}
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
          <div className={style.optionsContainer}>
            <Button
              className={clsx(style.button, {
                [style.activeButton]: currentSection === 'all',
              })}
              type="quaternary"
              size="small"
              onClick={() => setCurrentSection('all')}
            >
              {`All (${cosmons.length})`}
            </Button>
            <Button
              className={clsx('ml-[32px]', style.button, {
                [style.activeButton]: currentSection === 'available',
              })}
              type="quaternary"
              size="small"
              onClick={() => setCurrentSection('available')}
            >
              {`Available (${availableCosmons.length})`}
            </Button>
            <Button
              type="quaternary"
              size="small"
              className={clsx('ml-[32px]', style.button, {
                [style.activeButton]: currentSection === 'enrolled',
              })}
              onClick={() => setCurrentSection('enrolled')}
            >
              {`Enrolled cards (${enrolledCosmons.length})`}
            </Button>
            <Button
              type="quaternary"
              size="small"
              className={clsx('ml-[32px]', style.button, {
                [style.activeButton]: currentSection === 'listed',
              })}
              onClick={() => setCurrentSection('listed')}
            >
              {`Listed Assets (${listedCosmons.length})`}
            </Button>
          </div>

          <CosmonsList
            className={style.cosmonsList}
            cosmons={filtredCosmons}
            onClickShowDetails={set_showCosmonDetail}
            onClickTransfer={set_assetToTransfer}
            variation={currentSection}
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
