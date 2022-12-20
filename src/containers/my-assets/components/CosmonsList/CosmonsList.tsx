import { CosmonsListType } from '@containers/my-assets'
import { Coin } from '@cosmjs/proto-signing'
import { Transition } from '@headlessui/react'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import clsx from 'clsx'
import React, { useState } from 'react'
import { CosmonType } from 'types'
import CosmonListItem from './CosmonListItem/CosmonListItem'
import ListNftModal from './ListNftModal/ListNftModal'

interface CosmonsListProps {
  cosmons: CosmonType[]
  onClickTransfer: (cosmon: CosmonType) => void
  onClickShowDetails: (cosmon: CosmonType) => void
  variation: CosmonsListType
  className?: string
}

const CosmonsList: React.FC<CosmonsListProps> = ({
  cosmons,
  onClickTransfer,
  onClickShowDetails,
  variation,
  className,
}) => {
  const [displayListNftModal, setDisplayListNftModal] = useState(false)
  const [selectedCosmon, setSelectedCosmon] = useState<CosmonType | null>(null)
  const { listNft, unlistNft } = useMarketPlaceStore()

  const onClickList = (cosmon: CosmonType) => {
    setSelectedCosmon(cosmon)
    handleDisplayListModal()
  }

  const onClickUnlist = (cosmon: CosmonType) => {
    unlistNft(cosmon.id)
  }

  const handleDisplayListModal = () => {
    setDisplayListNftModal(true)
  }

  const handleHideListModal = () => {
    setDisplayListNftModal(false)
    setSelectedCosmon(null)
  }

  const handleSubmitListNft = async (nftId: string, price: Coin) => {
    await listNft(nftId, price)
    handleHideListModal()
  }

  return (
    <>
      <Transition show={true} appear={true}>
        <div
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(167px, max-content))',
          }}
          className={clsx(
            'mx-auto mt-[40px] grid max-w-[1180px] justify-center gap-[60px] px-8 lg:mt-40 lg:justify-start',
            className
          )}
        >
          {cosmons.map((cosmon) => (
            <div
              key={cosmon.id}
              className="group overflow-visible transition-transform hover:scale-[104%]"
            >
              <CosmonListItem
                onClickList={onClickList}
                onClickUnlist={onClickUnlist}
                onClickTransfer={onClickTransfer}
                cosmon={cosmon}
                variation={variation}
                onClick={onClickShowDetails}
              />
            </div>
          ))}
        </div>
      </Transition>
      {displayListNftModal && selectedCosmon ? (
        <ListNftModal
          cosmon={selectedCosmon}
          handleCloseModal={handleHideListModal}
          handleSubmitListNft={handleSubmitListNft}
        />
      ) : null}
    </>
  )
}

export default CosmonsList
