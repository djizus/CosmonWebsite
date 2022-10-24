import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Scarcity } from '../../../types/Scarcity'
import { useCosmonStore } from '../../store/cosmonStore'
import { useWalletStore } from '../../store/walletStore'
import Button from '../Button/Button'
import BigNumber from 'bignumber.js'
import { getAmountFromDenom } from '@utils/index'
import Tooltip from '@components/Tooltip/Tooltip'

type BuyableCardProps = {
  type: Scarcity
  yieldPercent: string
  img: string
  isCurrentlyBuying: boolean
  buy: (price: string) => void
}

export default function BuyableCard({
  isCurrentlyBuying,
  type,
  yieldPercent,
  img,
  buy,
}: BuyableCardProps) {
  const { isConnected, isFetchingData, coins } = useWalletStore((state) => state)

  const { isSellOpen, isPreSellOpen, whitelistData } = useCosmonStore((state) => state)

  const { getCosmonScarcityAvailable, getCosmonPrice: fetchCosmonPrice } = useCosmonStore(
    (state) => state
  )

  const [cosmonAvailable, set_cosmonAvailable] = useState<boolean | null>(null)
  const [cosmonPrice, set_cosmonPrice] = useState<string>('XX')
  const [cosmonDiscountPrice, set_cosmonDiscountPrice] = useState<string | null>(null)

  const getCosmonAvailable = async () => {
    let isAvailable = false
    const cosmonLeftByScarcity = (await getCosmonScarcityAvailable(type)) > 0
    const cosmonWhitelistLeft =
      whitelistData && whitelistData?.available_slots > whitelistData?.used_slots
    if (isSellOpen && cosmonLeftByScarcity) {
      isAvailable = true
    } else if (isPreSellOpen && cosmonWhitelistLeft && cosmonLeftByScarcity) {
      isAvailable = true
    }

    set_cosmonAvailable(isAvailable)
  }

  const hasEnoughCoinsToBuy = useMemo(() => {
    if (cosmonPrice !== 'XX') {
      const availableBalance = getAmountFromDenom(
        process.env.NEXT_PUBLIC_IBC_DENOM_RAW || '',
        coins
      )
      return availableBalance > +cosmonPrice
    }
  }, [cosmonPrice, coins])

  const getCosmonPrice = async () => {
    let price = await fetchCosmonPrice(type)
    if (
      whitelistData &&
      whitelistData.discount_percent !== 0 &&
      whitelistData.used_slots < whitelistData.available_slots
    ) {
      set_cosmonDiscountPrice(
        new BigNumber(price)
          .minus(new BigNumber(price).multipliedBy(whitelistData.discount_percent).dividedBy(100))
          .plus(0.01)
          .toFixed(2)
          .toString()
      )
    } else {
      set_cosmonDiscountPrice(null)
    }
    set_cosmonPrice(Number(price).toFixed(2))
  }

  useEffect(() => {
    if (isConnected) {
      getCosmonAvailable()
      getCosmonPrice()
    }
  }, [whitelistData?.used_slots, isFetchingData])

  useEffect(() => {
    getCosmonPrice()
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[224px] w-full lg:h-[284px] lg:w-[170px]">
        <Image layout="fill" objectFit="contain" src={`../cosmons/buyable-card/${img}`} />
      </div>
      <p className="pt-6 text-[22px] font-bold leading-[27px] text-[#E7E7E7]">{type}</p>

      <div className="mt-2 rounded-lg bg-cosmon-main-primary px-[10px] py-1 text-center text-base font-semibold text-white">
        {yieldPercent}% APR*
      </div>
      <p className="mt-5 flex gap-x-3 pt-1  text-base font-bold text-[#B1A8B9] ">
        <span className={`${cosmonDiscountPrice && 'line-through'} uppercase`}>
          {cosmonPrice} {process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}
        </span>
        {cosmonDiscountPrice && (
          <span className={`uppercase`}>
            {cosmonDiscountPrice} {process.env.NEXT_PUBLIC_IBC_DENOM_HUMAN}
          </span>
        )}
      </p>

      {isConnected && (
        <>
          <div className="pt-3" data-tip="tootlip" data-for={`buy-${type}`}>
            <Button
              isLoading={isCurrentlyBuying || cosmonAvailable === null}
              disabled={!cosmonAvailable || !hasEnoughCoinsToBuy}
              size={'small'}
              onClick={() => buy(cosmonDiscountPrice ? cosmonDiscountPrice : cosmonPrice)}
            >
              {cosmonAvailable === null ? 'Fetching data' : cosmonAvailable ? 'Buy' : 'Unavailable'}
            </Button>
          </div>
          {!hasEnoughCoinsToBuy ? (
            <Tooltip id={`buy-${type}`} place="top">
              <p>You don’t have enough ATOM in your wallet. Please deposit ATOMs</p>
            </Tooltip>
          ) : null}
        </>
      )}
    </div>
  )
}
