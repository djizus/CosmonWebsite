import { useEffect, useState } from 'react'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import * as style from './style.module.scss'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import Header from './components/Header/Header'
import { useWalletStore } from '@store/walletStore'
import CosmonsList from './components/CosmonsList/CosmonsList'
import { CosmonType, KiInformationResponse } from 'types'
import { useRouter } from 'next/router'
import Button from '@components/Button/Button'

interface MarketplaceProps {}

export const itemPerPage = 16

const Marketplace: React.FC<MarketplaceProps> = () => {
  const { fetchCosmonsForMarketPlace, fetchKPI, floor, totalVolume, cosmonsInMarketplace } =
    useMarketPlaceStore()
  const [page, setPage] = useState(0)
  const { isConnected } = useWalletStore()
  const router = useRouter()

  const handleClickShowDetails = (cosmon: CosmonType) => {
    router.push(`/marketplace/${cosmon.id}`)
  }

  useEffect(() => {
    if (isConnected) {
      fetchCosmonsForMarketPlace(itemPerPage, true)
      fetchKPI()
    }
  }, [isConnected])

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
        <CosmonsList cosmons={cosmonsInMarketplace} onClickShowDetails={handleClickShowDetails} />
        <div className={style.paginationContainer}>
          <Button
            className={style.paginationButton}
            type="ghost"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            type="ghost"
            className={style.paginationButton}
            disabled={cosmonsInMarketplace.length < itemPerPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </ConnectionNeededContent>
    </div>
  )
}

export default Marketplace
