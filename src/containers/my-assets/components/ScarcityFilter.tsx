import { useWalletStore } from '@store/walletStore'
import { getScarcitiesNumberByCosmons } from '@utils/cosmon'
import { isMobile } from '@walletconnect/browser-utils'
import React from 'react'
import { CosmonType, scarcities, Scarcity } from 'types'

interface ScarcityFilterProps {
  onSelectScarcity?: (scarcity: Scarcity) => void
}

const ScarcityFilter: React.FC<ScarcityFilterProps> = ({ onSelectScarcity }) => {
  const { cosmons } = useWalletStore()

  return (
    <>
      {isMobile() ? (
        <ScarcityFilterMobile cosmons={cosmons} />
      ) : (
        <ScarcityFilterDesktop cosmons={cosmons} />
      )}
    </>
  )
}

export default ScarcityFilter

interface ScarcityFilterCommonProps {
  cosmons: CosmonType[]
  onSelectScarcity?: (scarcity: Scarcity) => void
}

const ScarcityFilterDesktop: React.FC<ScarcityFilterCommonProps> = ({
  cosmons,
  onSelectScarcity,
}) => {
  return (
    <div className="flex items-center text-[22px] font-semibold text-white">
      My Cosmon Assets
      <div className="flex items-center gap-x-4">
        <img
          className="ml-8"
          width="25"
          height="30"
          src="/icons/cards.svg"
          alt="My cosmon assets"
        />

        {cosmons.length}
        <div className="h-8 border border-[#989898]"></div>
        {scarcities.map((scarcity) => (
          <div key={scarcity} className="flex items-center gap-x-3 text-[22px]">
            <img width={40} height={40} src={`/rarity-levels/${scarcity.toLowerCase()}.png`} />
            {getScarcitiesNumberByCosmons(cosmons)?.find(
              (scarcityCount) => scarcityCount.key === scarcity
            )?.count || 0}
          </div>
        ))}
      </div>
    </div>
  )
}

const ScarcityFilterMobile: React.FC<ScarcityFilterCommonProps> = ({
  cosmons,
  onSelectScarcity,
}) => {
  return (
    <div className="flex flex-col ">
      <h4 className="text-left text-[22px] font-semibold text-white">My Cosmon Assets</h4>
      <div className="mt-[35px] flex items-center gap-x-4">
        <img width="25" height="30" src="/icons/cards.svg" alt="My cosmon assets" />
        <p className="text-[22px] font-semibold text-white">{cosmons.length}</p>
      </div>
      <div className="mt-[30px] flex items-center gap-x-4">
        {scarcities.slice(0, 3).map((scarcity) => (
          <div key={scarcity} className="flex items-center gap-x-3">
            <img width={36} height={36} src={`/rarity-levels/${scarcity.toLowerCase()}.png`} />

            <p className="text-[22px] font-semibold text-white">
              {getScarcitiesNumberByCosmons(cosmons).find(
                (scarcityCount) => scarcityCount.key === scarcity
              )?.count || 0}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-[30px] flex items-center gap-x-4">
        {scarcities.slice(3, 6).map((scarcity) => (
          <div key={scarcity} className="flex items-center gap-x-3">
            <img width={36} height={36} src={`/rarity-levels/${scarcity.toLowerCase()}.png`} />

            <p className="text-[22px] font-semibold text-white">
              {getScarcitiesNumberByCosmons(cosmons).find(
                (scarcityCount) => scarcityCount.key === scarcity
              )?.count || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
