import { useEffect } from 'react'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import * as style from './style.module.scss'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import { useRouter } from 'next/router'
import LoadingIcon from '@components/LoadingIcon/LoadingIcon'
import CosmonDetails from './components/CosmonDetails/CosmonDetails'
import { useWalletStore } from '@store/walletStore'
import { KiInformationResponse } from 'types'
import { convertDenomToMicroDenom } from '@utils/conversion'

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
        router.push('/marketplace')
      }
    }
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
          {detailedCosmon ? (
            <CosmonDetails
              buyNftLoading={buyNftLoading}
              buyNft={handleBuyNft}
              kiData={kiData}
              cosmon={detailedCosmon}
            />
          ) : null}
        </ConnectionNeededContent>
      )}
    </div>
  )
}

ListedCosmonDetails.displayName = 'ListedCosmonDetails'

export default ListedCosmonDetails
