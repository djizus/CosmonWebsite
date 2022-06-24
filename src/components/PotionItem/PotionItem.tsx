import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Scarcity } from '../../../types/Scarcity'
import { useWalletStore } from '../../store/walletStore'
import Button from '../Button/Button'

type PotionItemProps = {
  type: Scarcity
  price: string
  yieldPercent: string
  img: string
  isCurrentlyBuying: boolean
  buy?: () => void
}

export default function PotionItem({
  isCurrentlyBuying,
  type,
  price,
  yieldPercent,
  img,
  buy,
}: PotionItemProps) {
  const { isConnected, getCosmonScarcityAvailable } = useWalletStore(
    (state) => state
  )

  const [cosmonAvailable, set_cosmonAvailable] = useState<number | null>(null)

  const getCosmonAvailable = async () => {
    set_cosmonAvailable(await getCosmonScarcityAvailable(type))
  }

  useEffect(() => {
    isConnected && getCosmonAvailable()
  }, [isConnected])

  useEffect(() => {
    // console.log('cosmonAvailable', cosmonAvailable)
  }, [cosmonAvailable])

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
      <p className="mt-5 pt-1 text-base font-bold  text-[#B1A8B9] blur-[1.5px]">
        {/* {price} */}
        XX ATOM
      </p>

      {isConnected && (
        <div className="pt-3">
          <Button
            isLoading={isCurrentlyBuying || cosmonAvailable === null}
            // type={'secondary'}
            disabled
            // disabled={!cosmonAvailable}
            size={'small'}
            type="disabled-colored"
            onClick={buy}
          >
            {cosmonAvailable === null
              ? 'Fetching data'
              : cosmonAvailable > 0
              ? 'Buy (soon)'
              : 'Sold out'}
          </Button>
        </div>
      )}
    </div>
  )
}
