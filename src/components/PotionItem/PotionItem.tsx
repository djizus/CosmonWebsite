import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Scarcity } from '../../../types/Scarcity'
import { useWalletStore } from '../../store/walletStore'
import Button from '../Button/Button'

type PotionItemProps = {
  type: Scarcity
  price: string
  img: string
  isCurrentlyBuying: boolean
  buy?: () => void
}

export default function PotionItem({
  isCurrentlyBuying,
  type,
  price,
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
      <div className="relative flex h-[100px] w-full">
        <Image layout="fill" objectFit="contain" src={`/potions/${img}`} />
      </div>
      <p className="pt-6 text-[22px] font-bold leading-[27px] text-[#E7E7E7]">
        {type}
      </p>

      <p className="pt-1 text-[16px] font-bold leading-[26px] text-[#B1A8B9]">
        {price}
      </p>

      {isConnected && (
        <div className="pt-8">
          <Button
            isLoading={isCurrentlyBuying || cosmonAvailable === null}
            // type={'secondary'}
            disabled={!cosmonAvailable}
            size={'small'}
            onClick={buy}
          >
            {cosmonAvailable === null
              ? 'Fetching data'
              : cosmonAvailable > 0
              ? 'Buy'
              : 'Sold out'}
          </Button>
        </div>
      )}
    </div>
  )
}
