import LoadingIcon from '@components/LoadingIcon/LoadingIcon'
import { useDeckStore } from '@store/deckStore'
import { useWalletStore } from '@store/walletStore'
import React from 'react'

interface DecksEmptyListProps {}

const DecksEmptyList: React.FC<DecksEmptyListProps> = ({}) => {
  const { isFetchingData, isFetchingCosmons } = useWalletStore()
  const { isFetchingDecksList } = useDeckStore()

  return (
    <div className="mt-[100px] mb-[175px]">
      {isFetchingData || isFetchingCosmons || isFetchingDecksList ? (
        <div className="flex h-[200px] w-full items-center justify-center">
          <LoadingIcon />
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center">
          <img
            className="h-[325px] object-contain"
            src="/hold-and-earn/cards-background.png"
          />
          <p className="mt-[26px] text-[20px] font-semibold leading-[32px] text-white">
            No deck here... Build one!
          </p>
          <p className="mt-[12px] text-[14px] leading-[18px] text-white">
            You don’t have any deck yet, build one with your Cosmon, <br />
            you need 3 of them to start the adventure.
          </p>
        </div>
      )}
    </div>
  )
}

export default DecksEmptyList
