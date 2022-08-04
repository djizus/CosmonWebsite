import { useRouter } from 'next/router'
import React, { useCallback, useContext } from 'react'
import { DeckBuilderContext } from '../DeckBuilderContext'

interface NFTsEmptyListProps {}

const NFTsEmptyList: React.FC<NFTsEmptyListProps> = ({}) => {
  const { handleCloseModal } = useContext(DeckBuilderContext)
  const router = useRouter()

  const handleClickBuyCosmon = useCallback(() => {
    router.push('/buy-cosmon')
    handleCloseModal()
  }, [])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <img
        className="h-[325px] object-contain"
        src="/hold-and-earn/cards-background.png"
      />
      <p className="mt-[26px] text-[18px] font-semibold leading-[32px] text-cosmon-main-secondary">
        No Cosmon card here...
      </p>
      <p className="mt-[12px] text-[12px] leading-[18px] text-cosmon-main-secondary">
        You need at least 3 Cosmons to start the adventure.
      </p>

      <div
        className="mt-[24px] cursor-pointer rounded-[12px] border-[.5px] border-cosmon-main-secondary bg-transparent px-[54px] py-[13px] text-sm font-semibold text-cosmon-main-secondary"
        onClick={handleClickBuyCosmon}
      >
        Buy Cosmon
      </div>
    </div>
  )
}

export default NFTsEmptyList
