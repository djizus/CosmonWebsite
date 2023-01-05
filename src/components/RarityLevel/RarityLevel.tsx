import Image from 'next/image'
import { Scarcity } from 'types'

export type RarityLevelProps = {
  type: Scarcity
  comingSoon?: boolean
}

export default function RarityLevel({ type, comingSoon }: RarityLevelProps) {
  return (
    <div className="flex flex-col items-center">
      <Image height="112px" width="112px" src={`/rarity-levels/${type.toLowerCase()}.png`}></Image>
      <div>
        <div className="text-center text-[18px] font-bold uppercase leading-[36px] tracking-[0.12em] text-white">
          {type}
        </div>
      </div>
      {comingSoon && (
        <div className="mt-3">
          <div className="flex h-[42px] w-[143px] items-center justify-center rounded-lg bg-white bg-opacity-20">
            <div
              style={{
                background:
                  '-webkit-linear-gradient(355deg, #A996FF 0%, rgba(118, 96, 216, 0.5) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              className="font-black tracking-wider"
            >
              Coming soon
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
