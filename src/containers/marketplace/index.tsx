import { useEffect, useMemo, useState } from 'react'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import * as style from './style.module.scss'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import Header from './components/Header/Header'
import { useWalletStore } from '@store/walletStore'
import CosmonsList from './components/CosmonsList/CosmonsList'
import { CosmonType, KiInformationResponse } from 'types'
import { useRouter } from 'next/router'
import Button from '@components/Button/Button'
import clsx from 'clsx'

interface MarketplaceProps {}

export const itemPerPage = 16
export type MarketPlaceListType = 'all' | 'mine'

const Marketplace: React.FC<MarketplaceProps> = () => {
  const {
    fetchCosmonsForMarketPlace,
    fetchSellingNftFromAddress,
    fetchKPI,
    floor,
    totalVolume,
    cosmonsInMarketplace,
    myListedCosmons,
    cosmonsForMarketPlaceLoading,
  } = useMarketPlaceStore()
  const [page, setPage] = useState(0)
  const { isConnected, address } = useWalletStore()
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState<MarketPlaceListType>('all')

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     handleRefreshPageData(false)
  //   }, 10000)

  //   return () => clearTimeout(timer)
  // }, [])

  useEffect(() => {
    if (isConnected) {
      handleRefreshPageData(true)
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      handleRefreshPageData(true)
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected) {
      // we load next page only if needed
      fetchCosmonsForMarketPlace(itemPerPage, false)
    }
  }, [page])

  const handleClickShowDetails = (cosmon: CosmonType) => {
    router.push(`/marketplace/${cosmon.id}`)
  }

  const handleRefreshPageData = (init: boolean) => {
    if (address && isConnected) {
      fetchCosmonsForMarketPlace(itemPerPage, init)
      fetchKPI()
      fetchSellingNftFromAddress(address)
    }
  }

  const filtredCosmons = useMemo(() => {
    switch (currentSection) {
      case 'all': {
        return cosmonsInMarketplace
      }

      case 'mine': {
        return myListedCosmons
      }

      default: {
        return cosmonsInMarketplace
      }
    }
  }, [cosmonsInMarketplace, myListedCosmons, currentSection, page])

  return (
    <div className={style.container}>
      <ConnectionNeededContent>
        <Header
          className={style.header}
          floor={floor}
          totalVolume={totalVolume}
          items={cosmonsInMarketplace.length}
          collection={cosmonsInMarketplace[0]?.collection}
        />
        <div className={style.optionsContainer}>
          <Button
            className={clsx(style.button, {
              [style.activeButton]: currentSection === 'all',
            })}
            type="quaternary"
            size="small"
            onClick={() => setCurrentSection('all')}
          >
            {`All`}
          </Button>
          <Button
            className={clsx(style.button, style.buttonMargin, {
              [style.activeButton]: currentSection === 'mine',
            })}
            type="quaternary"
            size="small"
            onClick={() => setCurrentSection('mine')}
          >
            {`My listing (${myListedCosmons.length})`}
          </Button>
        </div>
        <CosmonsList cosmons={filtredCosmons} onClickShowDetails={handleClickShowDetails} />
        {currentSection === 'all' ? (
          <div className={style.paginationContainer}>
            <Button
              type="ghost"
              className={style.paginationButton}
              disabled={
                filtredCosmons.slice(itemPerPage * page, itemPerPage * page + itemPerPage).length <
                itemPerPage
              }
              onClick={() => setPage(page + 1)}
              isLoading={cosmonsForMarketPlaceLoading}
            >
              Load more
            </Button>
          </div>
        ) : null}
      </ConnectionNeededContent>
    </div>
  )
}

Marketplace.displayName = 'Marketplace'

export default Marketplace
