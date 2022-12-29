import { useEffect, useState } from 'react'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import * as style from './style.module.scss'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import { useRouter } from 'next/router'
import LoadingIcon from '@components/LoadingIcon/LoadingIcon'
import CosmonDetails from './components/CosmonDetails/CosmonDetails'
import { useWalletStore } from '@store/walletStore'
import { KiInformationResponse } from 'types'
import { convertDenomToMicroDenom } from '@utils/conversion'
import Link from 'next/link'
import CosmonBuyRecap from './components/CosmonBuyRecap/CosmonBuyRecap'
import TransactionHistory from './components/TransactionHistory/TransactionHistory'

interface ListedCosmonDetailsProps {
  kiData?: KiInformationResponse
}

const ListedCosmonDetails: React.FC<ListedCosmonDetailsProps> = ({ kiData }) => {
  const router = useRouter()
  const { isConnected } = useWalletStore()
  const { fetchDetailedCosmon, detailedCosmon, detailedCosmonLoading, buyNft, buyNftLoading } =
    useMarketPlaceStore()

  const handleBuyNft = async (nftId: string) => {
    if (detailedCosmon?.price) {
      const response = await buyNft(nftId, {
        amount: convertDenomToMicroDenom(detailedCosmon.price),
        denom: process.env.NEXT_PUBLIC_STAKING_DENOM!,
      })

      if (response) {
        setDisplayBuyRecap(true)
      }
    }
  }

  const [displayBuyRecap, setDisplayBuyRecap] = useState(true)

  const handleCloseBuyRecap = () => {
    setDisplayBuyRecap(false)
  }

  useEffect(() => {
    if (typeof router.query.id === 'string' && isConnected) {
      fetchDetailedCosmon(router.query.id)
    }
  }, [router.query, isConnected])

  return (
    <div className={style.container}>
      {detailedCosmonLoading || !isConnected ? (
        <LoadingIcon />
      ) : (
        <ConnectionNeededContent>
          <Link href={'/marketplace'}>
            <span className={style.backLink}>← Back to marketplace</span>
          </Link>
          {detailedCosmon ? (
            <>
              <CosmonDetails
                buyNftLoading={buyNftLoading}
                buyNft={handleBuyNft}
                kiData={kiData}
                cosmon={detailedCosmon}
              />
              <TransactionHistory className={style.transactionHistory} cosmon={detailedCosmon} />
            </>
          ) : null}
          {displayBuyRecap && detailedCosmon ? (
            <CosmonBuyRecap cosmon={detailedCosmon} handleCloseModal={handleCloseBuyRecap} />
          ) : null}
        </ConnectionNeededContent>
      )}
    </div>
  )
}

ListedCosmonDetails.displayName = 'ListedCosmonDetails'

export default ListedCosmonDetails
