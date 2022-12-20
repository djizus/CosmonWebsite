import Button from '@components/Button/Button'
import ButtonConnectWallet from '@components/Button/ButtonConnectWallet'
import BuyableCard from '@components/BuyableCard/BuyableCard'
import Tooltip from '@components/Tooltip/Tooltip'
import UnmaskOnReach from '@components/UnmaskOnReach/UnmaskOnReach'
import { useCosmonStore } from '@store/cosmonStore'
import { useWalletStore } from '@store/walletStore'
import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'
import { CosmonType, SCARCITIES, Scarcity } from 'types'
import BuyCosmonModal from './BuyCosmonModal/BuyCosmonModal'
import * as style from './BuyCosmonSection.module.scss'
import BuyDeckModal from './BuyDeckModal/BuyDeckModal'
import BigNumber from 'bignumber.js'
import { getAmountFromDenom } from '@utils'
import AnimatedImage from '@components/AnimatedImage/AnimatedImage'

interface Props {}

const BuyCosmonSection: React.FC<Props> = () => {
  const { buyCosmon, isConnected, mintFullDeck, coins } = useWalletStore()
  const { getCosmonPrice: fetchCosmonPrice, whitelistData } = useCosmonStore()

  const [displayBuyCosmonModal, setDisplayBuyCosmonModal] = useState<boolean>(false)
  const [displayBuyDeckModal, setDisplayBuyDeckModal] = useState<boolean>(false)

  const [cosmonBought, set_cosmonBought] = useState<null | CosmonType>(null)
  const [isCurrentlyBuying, set_isCurrentlyBuying] = useState<Scarcity | null>(null)

  const [deckBought, setDeckBought] = useState<CosmonType[]>([])
  const [isCurrentlyBuyingDeck, setIsCurrentlyBuyingDeck] = useState<boolean>(false)
  const [deckPrice, setDeckPrice] = useState<string>('XX')

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

  useEffect(() => {
    getDeckPrice()
  }, [])

  const buy = async (scarcity: Scarcity, price: string) => {
    set_isCurrentlyBuying(scarcity)
    try {
      set_cosmonBought(await buyCosmon(scarcity, price))
      handleShowCosmonModal()
    } catch (e: any) {
      console.error('Error! ', e)
    } finally {
      set_isCurrentlyBuying(null)
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
      <div
        className={clsx(
          'grid grid-cols-2 gap-y-[60px] lg:grid-cols-5',
          style.buyableCosmonsContainer
        )}
      >
        <UnmaskOnReach delay={0.2}>
          <BuyableCard
            buy={(price: string) => buy(SCARCITIES.COMMON, price)}
            yieldPercent={
              (process.env.NEXT_PUBLIC_YIELD_COMMON !== undefined &&
                process.env.NEXT_PUBLIC_YIELD_COMMON) ||
              'xx'
            }
            isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.COMMON}
            type={SCARCITIES.COMMON}
            img="common.png"
          />
        </UnmaskOnReach>
        <UnmaskOnReach delay={0.3}>
          <BuyableCard
            buy={(price: string) => buy(SCARCITIES.UNCOMMON, price)}
            yieldPercent={process.env.NEXT_PUBLIC_YIELD_UNCOMMON || 'xx'}
            isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.UNCOMMON}
            type={SCARCITIES.UNCOMMON}
            img="uncommon.png"
          />
        </UnmaskOnReach>
        <UnmaskOnReach delay={0.4}>
          <BuyableCard
            buy={(price) => buy(SCARCITIES.RARE, price)}
            yieldPercent={process.env.NEXT_PUBLIC_YIELD_RARE || 'xx'}
            isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.RARE}
            type={SCARCITIES.RARE}
            img="rare.png"
          />
        </UnmaskOnReach>
        <UnmaskOnReach delay={0.6}>
          <BuyableCard
            buy={(price) => buy(SCARCITIES.EPIC, price)}
            yieldPercent={process.env.NEXT_PUBLIC_YIELD_EPIC || 'xx'}
            isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.EPIC}
            type={SCARCITIES.EPIC}
            img="epic.png"
          />
        </UnmaskOnReach>
        <UnmaskOnReach delay={0.8}>
          <BuyableCard
            buy={(price) => buy(SCARCITIES.LEGENDARY, price)}
            yieldPercent={process.env.NEXT_PUBLIC_YIELD_LEGENDARY || 'xx'}
            isCurrentlyBuying={isCurrentlyBuying === SCARCITIES.LEGENDARY}
            type={SCARCITIES.LEGENDARY}
            img="legendary.png"
          />
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
