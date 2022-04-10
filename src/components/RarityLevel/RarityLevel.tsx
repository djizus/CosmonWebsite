import Image from 'next/image'
import { Scarcity } from '../../../types/Scarcity'
import Button from '../Button/Button'

export type RarityLevelProps = {
  type: Scarcity
  comingSoon?: boolean
}

export default function RarityLevel({ type, comingSoon }: RarityLevelProps) {
  return (
    <div className="">
      <Image
        height="112px"
        width="112px"
        src={`/rarity-levels/${type}.png`}
      ></Image>
      <div>
        <div className="text-center text-[18px] font-bold uppercase leading-[36px] tracking-[0.12em] text-white">
          {type}
        </div>
      </div>
      {comingSoon && (
        <div className="absolute -ml-10 mt-3">
          <Button type="primary" className="lg:max-h-10" disabled>
            Coming soon
          </Button>
        </div>
      )}
    </div>
  )
}
