import Button from '@components/Button/Button'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import { truncate } from '@utils/text'
import React, { useMemo } from 'react'
import { CosmonMarketPlaceType, KiInformationResponse } from 'types'
import * as style from './CosmonDetails.module.scss'
import { computeAttributesForCosmonDetails } from '@utils/marketplace'
import { useWalletStore } from '@store/walletStore'
import Tooltip from '@components/Tooltip/Tooltip'

interface Props {
  buyNftLoading: boolean
  buyNft: (nftId: string) => void
  cosmon: CosmonMarketPlaceType
  kiData?: KiInformationResponse
}

const CosmonDetails: React.FC<Props> = ({ buyNft, buyNftLoading, cosmon, kiData }) => {
  const attributes = useMemo(() => {
    return computeAttributesForCosmonDetails(cosmon)
  }, [cosmon])

  const { address } = useWalletStore()

  const handleBuy = () => {
    if (cosmon.price !== undefined) {
      buyNft(cosmon.id)
    }
  }

  return (
    <div className={style.container}>
      <CosmonCard
        cosmon={cosmon}
        showLevel
        showPersonality
        showScarcity
        showNationality
        size="lg"
        className={style.cosmonCard}
      />
      <div className={style.rightContainer}>
        <p className={style.cosmonLabel}>Cosmon #{cosmon.id}</p>
        <p className={style.cosmonOwner}>
          Owned by{' '}
          <span className={style.cosmonOwnerWallet}>
            {cosmon.owner ? truncate(cosmon.owner, 16) : '???'}
          </span>
        </p>
        <div className={style.cardPrice}>
          <p className={style.cardPriceTitle}>Current Price</p>
          <div className={style.linePrice}>
            <img className={style.kiLogo} src="/xki-logo.png" />
            <span className={style.priceValue}>{cosmon.price ?? '???'}</span>
            <span className={style.priceLabel}>XKI</span>
            <span className={style.priceUsdc}>{`($${
              cosmon.price && kiData ? (cosmon.price * kiData.price).toFixed(2) : '???'
            })`}</span>
          </div>
          <div
            className={style.buyButtonContainer}
            data-tip="tootlip"
            data-for={`cosmon-${cosmon.owner}`}
          >
            <Button
              disabled={cosmon.price === undefined || cosmon.owner === address}
              className={style.buyButton}
              withoutContainer
              onClick={handleBuy}
              isLoading={buyNftLoading}
            >
              Buy now
            </Button>
          </div>
          {cosmon.owner === address ? (
            <Tooltip id={`cosmon-${cosmon.owner}`} place="bottom">
              <p>You are the owner of this NFT</p>
            </Tooltip>
          ) : null}
        </div>
        <div className={style.cardAttributes}>
          <div className={style.headerAttribute}>
            <p className={style.titleAttributes}>Attributes</p>
          </div>
          <div className={style.attributesGrid}>
            {attributes.map((attribute) => {
              return (
                <div className={style.attributeItem} key={attribute.label}>
                  <p className={style.attributeLabel}>{attribute.label}</p>
                  <p className={style.attributValue}>{attribute.value}</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className={style.cardDetails}>
          <p className={style.titleDetails}>Details</p>
          <div>
            {/* <p className={style.labelDetails}>
              Token address: <span className={style.valueDetails}>{cosmon.collection}</span>
            </p> */}
            <p className={style.labelDetails}>
              Owner address: <span className={style.valueDetails}>{cosmon.owner ?? '???'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

CosmonDetails.displayName = 'CosmonDetails'

export default CosmonDetails
