import { useEffect, useMemo, useState } from 'react'
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
import { IS_MARKETPLACE_ACTIVE } from '@utils/constants'
import Pagination from '@components/Pagination/Pagination'
import LoadingIcon from '@components/LoadingIcon/LoadingIcon'

interface MyAssetsProps {}

export type CosmonsListType = 'all' | 'enrolled' | 'listed' | 'available'

export const COSMONS_PER_PAGE = 100

const MyAssets: React.FC<MyAssetsProps> = ({}) => {
  const { cosmons, cosmonsId, isFetchingCosmons, fetchCosmonsDetails } = useWalletStore()
  const [assetToTransfer, set_assetToTransfer] = useState<null | CosmonType>()
  const [showCosmonDetail, set_showCosmonDetail] = useState<CosmonType | null>()
  const [currentSection, setCurrentSection] = useState<CosmonsListType>('all')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleChangePage = (nextPage: number) => {
    setPage(nextPage)
  }

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
        return availableCosmons || []
      }

      case 'enrolled': {
        return enrolledCosmons || []
      }

      case 'listed': {
        return IS_MARKETPLACE_ACTIVE ? listedCosmons : cosmons
      }

      default: {
        return cosmons
      }
    }
  }, [cosmons, enrolledCosmons, currentSection])

  useEffect(() => {
    if (page >= 0 && cosmonsId.length > 0) {
      fetchCosmonsData()
    }
  }, [page, cosmonsId])

  const fetchCosmonsData = async () => {
    setLoading(true)
    await fetchCosmonsDetails(
      cosmonsId.slice(page * COSMONS_PER_PAGE, (page + 1) * COSMONS_PER_PAGE)
    )
    setLoading(false)
  }

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
              onClick={() => {
                setPage(0)
                setCurrentSection('all')
              }}
            >
              {`All (${cosmonsId.length})`}
            </Button>
            <Button
              className={clsx('ml-[32px]', style.button, {
                [style.activeButton]: currentSection === 'available',
              })}
              type="quaternary"
              size="small"
              onClick={() => {
                setPage(0)
                setCurrentSection('available')
              }}
            >
              {`Available (${availableCosmons.length})`}
            </Button>
            <Button
              type="quaternary"
              size="small"
              className={clsx('ml-[32px]', style.button, {
                [style.activeButton]: currentSection === 'enrolled',
              })}
              onClick={() => {
                setPage(0)
                setCurrentSection('enrolled')
              }}
            >
              {`Enrolled cards (${enrolledCosmons.length})`}
            </Button>
            {IS_MARKETPLACE_ACTIVE ? (
              <Button
                type="quaternary"
                size="small"
                className={clsx('ml-[32px]', style.button, {
                  [style.activeButton]: currentSection === 'listed',
                })}
                onClick={() => {
                  setPage(0)
                  setCurrentSection('listed')
                }}
              >
                {`Listed Assets (${listedCosmons.length})`}
              </Button>
            ) : null}
          </div>
          {isFetchingCosmons || loading ? (
            <div className={style.loaderContainer}>
              <LoadingIcon />
            </div>
          ) : (
            <>
              <CosmonsList
                className={style.cosmonsList}
                cosmons={filtredCosmons?.slice(
                  page * COSMONS_PER_PAGE,
                  (page + 1) * COSMONS_PER_PAGE
                )}
                onClickShowDetails={set_showCosmonDetail}
                onClickTransfer={set_assetToTransfer}
                variation={currentSection}
              />
              {filtredCosmons.length > COSMONS_PER_PAGE * (page + 1) ? (
                <div className={style.paginationContainer}>
                  <Pagination
                    itemsPerPage={COSMONS_PER_PAGE}
                    totalItems={cosmonsId.length}
                    currentPage={page}
                    onPageChange={handleChangePage}
                  />
                </div>
              ) : null}
            </>
          )}
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
