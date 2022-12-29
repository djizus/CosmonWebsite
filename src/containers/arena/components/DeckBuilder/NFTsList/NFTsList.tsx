import LoadingIcon from '@components/LoadingIcon/LoadingIcon'
import { useWalletStore } from '@store/walletStore'
import { getScarcityByCosmon, sortCosmonsByScarcity } from '@utils/cosmon'
import { AnimatePresence } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useContext } from 'react'
import { CosmonType } from 'types/Cosmon'
import { DeckBuilderContext } from '../DeckBuilderContext'
import NFTContainer from '../NFTContainer/NFTContainer'
import NFTsEmptyList from './NFTsEmptyList'
import NFTsListFilter from './NFTsListFilter'
import styles from './NFTsList.module.scss'
import { useMount } from 'react-use'

interface NFTsListProps {}

export const COSMONS_PER_PAGE = 100

const NFTsList: React.FC<NFTsListProps> = ({}) => {
  const { cosmonsId, fetchCosmonsDetails, isFetchingCosmons, cosmons } = useWalletStore()
  const { listFilter, nfts } = useContext(DeckBuilderContext)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isFirstLoading, setIsFirtLoading] = useState(false)
  const loadingRef = useRef<HTMLDivElement>(null)

  useMount(() => {
    setIsFirtLoading(true)
  })

  const hasMore = useMemo(() => {
    return cosmons.length < cosmonsId.length
  }, [cosmonsId, cosmons])

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore) {
        setPage((prev) => prev + 1)
      }
    },
    [hasMore]
  )

  const setRef = useCallback(
    (node) => {
      if (loadingRef.current) {
        // Make sure to cleanup any events/references added to the last instance
      }

      if (node) {
        const observer = new IntersectionObserver(handleObserver, {
          root: null,
          rootMargin: '0px',
          threshold: 1.0,
        })
        if (node) {
          observer.observe(node)
        } else {
          observer.disconnect()
        }
        // Check if a node is actually passed. Otherwise node would be null.
        // You can now do what you need to, addEventListeners, measure, etc.
      }

      // Save a reference to the node
      // loadingRef.current = node
    },
    [handleObserver]
  )

  useEffect(() => {
    if (page >= 0 && cosmonsId.length > 0 && hasMore) {
      fetchCosmonsData()
    }
  }, [page, cosmonsId, hasMore])

  const fetchCosmonsData = async () => {
    setLoading(true)
    if (isFirstLoading) {
      setIsFirtLoading(false)
    }
    await fetchCosmonsDetails(
      cosmonsId.slice(page * COSMONS_PER_PAGE, (page + 1) * COSMONS_PER_PAGE)
    )
    setLoading(false)
  }

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
      nftsList = [...nftsList.filter((nft) => nft.isInDeck === false || nft.temporaryFree === true)]
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

    return nftsList
  }, [listFilter, nfts, cosmons])

  return (
    <div className="flex h-full flex-col">
      <div className="">
        <NFTsListFilter />
      </div>
      <div className="d-flex relative h-full w-full flex-col overflow-y-scroll pb-[12px]">
        {isFirstLoading && (isFetchingCosmons || loading) ? (
          <div className={styles.loaderContainer}>
            <LoadingIcon />
          </div>
        ) : (
          <AnimatePresence>
            {nftsList?.length > 0 ? (
              <>
                {nftsList.map((nft, i) => (
                  <NFTContainer key={`${i}-${nft.id}`} nft={nft} listIdx={i} />
                ))}
                {hasMore ? (
                  <div ref={setRef} className={styles.loaderFooterContainer}>
                    <LoadingIcon />
                  </div>
                ) : null}
              </>
            ) : (
              <NFTsEmptyList />
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default NFTsList
