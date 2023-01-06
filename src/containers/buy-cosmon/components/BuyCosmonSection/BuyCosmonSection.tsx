import Button from '@components/Button/Button'
import ButtonConnectWallet from '@components/Button/ButtonConnectWallet'
import Tooltip from '@components/Tooltip/Tooltip'
import UnmaskOnReach from '@components/UnmaskOnReach/UnmaskOnReach'
import { useCosmonStore } from '@store/cosmonStore'
import { useWalletStore } from '@store/walletStore'
import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'
import { CosmonType, SCARCITIES } from 'types'
import BuyCosmonModal from './BuyCosmonModal/BuyCosmonModal'
import * as style from './BuyCosmonSection.module.scss'
import BuyDeckModal from './BuyDeckModal/BuyDeckModal'
import BigNumber from 'bignumber.js'
import { getAmountFromDenom } from '@utils'
import AnimatedImage from '@components/AnimatedImage/AnimatedImage'
import { Coin } from '@cosmjs/proto-signing'
import { convertMicroDenomToDenom } from '@utils/conversion'

interface Props {}

const BuyCosmonSection: React.FC<Props> = () => {
  const { buyRandomCosmon, isConnected, mintFullDeck, coins } = useWalletStore()
  const {
    getCosmonPrice: fetchCosmonPrice,
    whitelistData,
    getBlindMintPrice: fetchBlindMintPrice,
  } = useCosmonStore()

  const [displayBuyCosmonModal, setDisplayBuyCosmonModal] = useState<boolean>(false)
  const [displayBuyDeckModal, setDisplayBuyDeckModal] = useState<boolean>(false)

  const [cosmonBought, set_cosmonBought] = useState<null | CosmonType>(null)
  const [isCurrentlyBuying, set_isCurrentlyBuying] = useState<boolean>(false)

  const [deckBought, setDeckBought] = useState<CosmonType[]>([])
  const [isCurrentlyBuyingDeck, setIsCurrentlyBuyingDeck] = useState<boolean>(false)
  const [deckPrice, setDeckPrice] = useState<string>('XX')
  const [blindMintPrice, setBlindMintPrice] = useState<Coin | null>(null)

  const getDeckPrice = async () => {
    let price = await fetchCosmonPrice(SCARCITIES.COMMON)
    if (
      whitelistData &&
      whitelistData.discount_percent !== 0 &&
      whitelistData.used_slots < whitelistData.available_slots
    ) {
      setDeckPrice(
        new BigNumber(price)
          .multipliedBy(3)
          .minus(
            new BigNumber(price)
              .multipliedBy(3)
              .multipliedBy(whitelistData.discount_percent)
              .dividedBy(100)
          )
          .plus(0.01)
          .toFixed(2)
      )
    } else {
      setDeckPrice(new BigNumber(price).multipliedBy(3).toFixed(2))
    }
  }

  const getBlindMintPrice = async () => {
    let price = await fetchBlindMintPrice()
    if (
      whitelistData &&
      whitelistData.discount_percent !== 0 &&
      whitelistData.used_slots < whitelistData.available_slots
    ) {
      setBlindMintPrice(price)
    } else {
      setBlindMintPrice(price)
    }
  }

  useEffect(() => {
    getDeckPrice()
    getBlindMintPrice()
  }, [])

  const buy = async () => {
    if (blindMintPrice) {
      set_isCurrentlyBuying(true)
      try {
        set_cosmonBought(await buyRandomCosmon(blindMintPrice))
        handleShowCosmonModal()
      } catch (e: any) {
        console.error('Error! ', e)
      } finally {
        set_isCurrentlyBuying(false)
      }
    }
  }

  const mintDeck = async () => {
    if (deckPrice) {
      setIsCurrentlyBuyingDeck(true)
      try {
        setDeckBought(await mintFullDeck(deckPrice))
        handleShowDeckModal()
      } catch (error) {
        console.error('Error! ', error)
      } finally {
        setIsCurrentlyBuyingDeck(false)
      }
    }
  }

  const hasEnoughCoinsToBuyDeck = useMemo(() => {
    if (deckPrice !== 'XX' && coins) {
      const availableBalance = getAmountFromDenom(
        process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '',
        coins
      )
      return availableBalance > +deckPrice
    }
  }, [deckPrice, coins])

  const hasEnoughCoinsBlindMint = useMemo(() => {
    if (blindMintPrice) {
      const price = convertMicroDenomToDenom(blindMintPrice.amount)
      if (price && coins) {
        const availableBalance = getAmountFromDenom(
          process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '',
          coins
        )

        return availableBalance > +price
      }
    }

    return false
  }, [blindMintPrice, coins])

  const handleShowCosmonModal = () => {
    setDisplayBuyCosmonModal(true)
  }

  const handleShowDeckModal = () => {
    setDisplayBuyDeckModal(true)
  }

  const handleHideCosmonModal = () => {
    setDisplayBuyCosmonModal(false)
    set_cosmonBought(null)
  }
  const handleHideDeckModal = () => {
    setDisplayBuyDeckModal(false)
    setDeckBought([])
  }

  return (
    <div className={style.container}>
      <div className={style.deckContainer}>
        <AnimatedImage
          imgSrc="/getting-started/raffle-one-deck.png"
          imgClassName={style.imgStarterPack}
        />
        <div className={style.rightDeckContainer}>
          <p className={style.deckTitle}>Full common deck </p>
          <p className={style.description}>
            This deck allows you to acquire a “ready-to-play” deck.
            <br />
            You will get 3 NFT Cards with random common Leaders.
          </p>
          <p className={style.deckQuestion}>WHAT’S INSIDE ?</p>
          <p className={style.deckQuestionAnswers}>{`> 3 NFT Cards`}</p>
          <p className={style.deckQuestionAnswers}>{`> Scarcity: Common`}</p>
          {isConnected ? (
            <div data-tip="tootlip" data-for={`buy-deck`}>
              <Button
                disabled={!hasEnoughCoinsToBuyDeck || !deckPrice}
                withoutContainer
                className={style.buyDeckButton}
                onClick={mintDeck}
                isLoading={isCurrentlyBuyingDeck}
              >
                Buy starter deck for {deckPrice} ATOM
              </Button>
              {!hasEnoughCoinsToBuyDeck ? (
                <Tooltip id={`buy-deck`} place="top">
                  <p>You don’t have enough ATOM in your wallet. Please deposit ATOMs</p>
                </Tooltip>
              ) : null}
            </div>
          ) : (
            <ButtonConnectWallet className={style.connectButton} />
          )}
        </div>
      </div>
      <UnmaskOnReach delay={0.2}>
        <p className={style.secondTitle}>... or buy a Cosmon Card </p>
        <p className={style.secondDescription}>
          Get a random Cosmon from a given scarcity level or mint a full deck!
        </p>
        <p className={style.secondSubDescription}>
          The rarer your Cosmons are, the more yield you will get from it.
          <br />
          Your Cosmon's initial characteristics will also be higher with an upper rarity.
        </p>
      </UnmaskOnReach>
      <div className={clsx(style.buyableCosmonsContainer)}>
        <UnmaskOnReach delay={0.2}>
          <img className={style.randomCardImg} src="/cosmons/buyable-card/every-card.png" />
          {isConnected ? (
            <div data-tip="tootlip" data-for={`blind-mint`}>
              <Button
                onClick={buy}
                disabled={!hasEnoughCoinsBlindMint}
                isLoading={isCurrentlyBuying}
                className={style.buyRandomCardButton}
                withoutContainer
              >
                Buy random card for{' '}
                {blindMintPrice ? convertMicroDenomToDenom(blindMintPrice.amount) : 'XX'} ATOM
              </Button>
              {!hasEnoughCoinsToBuyDeck ? (
                <Tooltip id={`blind-mint`} place="top">
                  <p>You don’t have enough ATOM in your wallet. Please deposit ATOMs</p>
                </Tooltip>
              ) : null}
            </div>
          ) : (
            <ButtonConnectWallet withoutContainer className={style.connectButton} />
          )}
        </UnmaskOnReach>
      </div>
      {displayBuyCosmonModal && cosmonBought ? (
        <BuyCosmonModal cosmon={cosmonBought} handleCloseModal={handleHideCosmonModal} />
      ) : null}
      {displayBuyDeckModal && deckBought.length === 3 ? (
        <BuyDeckModal cosmons={deckBought} handleCloseModal={handleHideDeckModal} />
      ) : null}
    </div>
  )
}

BuyCosmonSection.displayName = 'BuyCosmonSection'

export default BuyCosmonSection
