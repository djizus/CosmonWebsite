import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Scarcity } from '../../../types/Scarcity'
import { useCosmonStore } from '../../store/cosmonStore'
import { useWalletStore } from '../../store/walletStore'
import Button from '../Button/Button'
import BigNumber from 'bignumber.js'

type PotionItemProps = {
  type: Scarcity
  // price: string
  yieldPercent: string
  img: string
  isCurrentlyBuying: boolean
  buy: (price: string) => void
}

export default function PotionItem({
  isCurrentlyBuying,
  type,
  yieldPercent,
  img,
  buy,
}: PotionItemProps) {
  const { isConnected, isFetchingData } = useWalletStore((state) => state)

  const { isSellOpen, isPreSellOpen, whitelistData } = useCosmonStore(
    (state) => state
  )

  const { getCosmonScarcityAvailable, getCosmonPrice: fetchCosmonPrice } =
    useCosmonStore((state) => state)

  // console.log('price', price)
  const [cosmonAvailable, set_cosmonAvailable] = useState<boolean | null>(null)
  const [cosmonPrice, set_cosmonPrice] = useState<string>('XX')
  const [cosmonDiscountPrice, set_cosmonDiscountPrice] = useState<
    string | null
  >(null)

  const getCosmonAvailable = async () => {
    let isAvailable = false
    const cosmonLeftByScarcity = (await getCosmonScarcityAvailable(type)) > 0
    const cosmonWhitelistLeft =
      whitelistData &&
      whitelistData?.available_slots > whitelistData?.used_slots
    if (isSellOpen && cosmonLeftByScarcity) {
      isAvailable = true
    } else if (isPreSellOpen && cosmonWhitelistLeft && cosmonLeftByScarcity) {
      isAvailable = true
    }

    set_cosmonAvailable(isAvailable)
  }

  const getCosmonPrice = async () => {
    let price = await fetchCosmonPrice(type)
    if (
      whitelistData &&
      whitelistData.discount_percent !== 0 &&
      whitelistData.used_slots < whitelistData.available_slots
    ) {
      set_cosmonDiscountPrice(
        new BigNumber(price)
          .minus(
            new BigNumber(price)
              .multipliedBy(whitelistData.discount_percent)
              .dividedBy(100)
          )
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

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[140px] w-full">
        <Image layout="fill" objectFit="contain" src={`../potions/${img}`} />
      </div>
      <p className="pt-6 text-[22px] font-bold leading-[27px] text-[#E7E7E7]">
        {type}
      </p>

      <div className="mt-2 rounded-lg bg-cosmon-main-primary px-[10px] py-1 text-center text-base font-semibold text-white">
        {yieldPercent}% APR*
      </div>
      <p className="mt-5 flex gap-x-3 pt-1  text-base font-bold text-[#B1A8B9] ">
        {/* {price} */}

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
        <div className="pt-3">
          <Button
            isLoading={isCurrentlyBuying || cosmonAvailable === null}
            // type={'secondary'}
            // disabled
            disabled={!cosmonAvailable}
            size={'small'}
            onClick={() =>
              buy(cosmonDiscountPrice ? cosmonDiscountPrice : cosmonPrice)
            }
          >
            {cosmonAvailable === null
              ? 'Fetching data'
              : cosmonAvailable
              ? 'Buy'
              : 'Unavailable'}
          </Button>
        </div>
      )}
    </div>
  )
}
