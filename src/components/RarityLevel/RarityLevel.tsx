import Image from 'next/image'

export type RarityLevelType =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'divinity'

export type RarityLevelProps = {
  type: RarityLevelType
}

export default function RarityLevel({ type }: RarityLevelProps) {
  return (
    <div>
      <Image
        height="112px"
        width="112px"
        src={`/rarity-levels/${type}.png`}
      ></Image>
      <div>
        <div className="text-[18px] font-bold uppercase leading-[36px] tracking-[0.12em] text-white">
          {type}
        </div>
      </div>
    </div>
  )
}
