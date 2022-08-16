import { useWalletStore } from '@store/walletStore'
import { getScarcityByCosmon, sortCosmonsByScarcity } from '@utils/cosmon'
import { AnimatePresence } from 'framer-motion'
import React, { useMemo } from 'react'
import { useContext } from 'react'
import { CosmonType } from 'types/Cosmon'
import { DeckBuilderContext } from '../DeckBuilderContext'
import NFTContainer from '../NFTContainer/NFTContainer'
import NFTsEmptyList from './NFTsEmptyList'
import NFTsListFilter from './NFTsListFilter'

interface NFTsListProps {}

const NFTsList: React.FC<NFTsListProps> = ({}) => {
  const { cosmons } = useWalletStore((state) => state)
  const { listFilter, nfts } = useContext(DeckBuilderContext)

  const nftsList = useMemo(() => {
    let nftsList: CosmonType[] = cosmons
    if (listFilter.search !== '') {
      const nftsListFiltered = nftsList.filter((nft) =>
        new RegExp(listFilter.search, 'gi').test(nft.data.extension.name)
      )
      nftsList = [...nftsListFiltered]
    } else {
      if (!cosmons.every((c) => cosmons.includes(c))) {
        nftsList = [...cosmons]
      }
    }

    if (listFilter.showUnused === true) {
      nftsList = [
        ...nftsList.filter(
          (nft) => nft.isInDeck === false || nft.temporaryFree === true
        ),
      ]
    } else {
      nftsList = [
        ...nftsList.filter((nft) => nft.isInDeck === false),
        ...nftsList.filter((nft) => nft.isInDeck === true),
      ]
    }

    if (listFilter.scarcities.length > 0) {
      const nftsListFiltered = nftsList.filter((nft) =>
        listFilter.scarcities.includes(getScarcityByCosmon(nft)!)
      )
      nftsList = [...nftsListFiltered]
    } else {
      if (!cosmons.every((c) => cosmons.includes(c))) {
        nftsList = [...cosmons]
      }
    }

    return sortCosmonsByScarcity(nftsList)
  }, [listFilter, nfts, cosmons])

  return (
    <div className="flex h-full flex-col">
      <div className="">
        <NFTsListFilter />
      </div>
      <div className="w-full flex-1 flex-col overflow-y-scroll pb-[12px] ">
        <AnimatePresence>
          {(nftsList?.length > 0 &&
            nftsList.map((nft, i) => (
              <NFTContainer key={nft.id} nft={nft} listIdx={i} />
            ))) || <NFTsEmptyList />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NFTsList
