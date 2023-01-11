import { CosmonsListType } from '@containers/my-assets'
import { Coin } from '@cosmjs/proto-signing'
import { Transition } from '@headlessui/react'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import clsx from 'clsx'
import React, { useState } from 'react'
import { CosmonType } from 'types'
import CosmonListItem from './CosmonListItem/CosmonListItem'
import ListNftModal from '../../../../components/Modal/ListNftModal/ListNftModal'
import UnlistNftModal from '@components/Modal/UnlistNftModal/UnlistNftModal'
import ListConfirmNftModal from '@components/Modal/ListConfirmNftModal/ListConfirmNftModal'
import UnlistConfirmNftModal from '@components/Modal/UnlistConfirmNftModal/UnlistConfirmNftModal'

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
  const [displayUnlistNftModal, setDisplayUnlistNftModal] = useState(false)
  const [displayListNftModal, setDisplayListNftModal] = useState(false)
  const [displayListConfirmNftModal, setDisplayListConfirmNftModal] = useState(false)
  const [displayUnListConfirmNftModal, setDisplayUnListConfirmNftModal] = useState(false)
  const [selectedCosmon, setSelectedCosmon] = useState<CosmonType | null>(null)
  const { listNft, unlistNft } = useMarketPlaceStore()

  const handleDisplayUnlistModal = () => {
    setDisplayUnlistNftModal(true)
  }

  const handleHideUnlistModal = () => {
    setDisplayUnlistNftModal(false)
  }

  const onClickUnlist = (cosmon: CosmonType) => {
    setSelectedCosmon(cosmon)
    handleDisplayUnlistModal()
  }

  const handleSubmitUnlistNft = async (nftId: string, price: number | undefined) => {
    if (price !== undefined) {
      try {
        await unlistNft(nftId, price)
        handleHideUnlistModal()
        handleDisplayUnListConfirmModal()
      } catch (error) {}
    }
  }

  const onClickList = (cosmon: CosmonType) => {
    setSelectedCosmon(cosmon)
    handleDisplayListModal()
  }

  const handleDisplayListModal = () => {
    setDisplayListNftModal(true)
  }

  const handleHideListModal = () => {
    setDisplayListNftModal(false)
    setSelectedCosmon(null)
  }

  const handleSubmitListNft = async (nftId: string, price: Coin) => {
    try {
      await listNft(nftId, price)
      setDisplayListNftModal(false)
      handleDisplayListConfirmModal()
    } catch (error) {}
  }

  const handleDisplayListConfirmModal = () => {
    setDisplayListConfirmNftModal(true)
  }

  const handleHideListConfirmModal = () => {
    setDisplayListConfirmNftModal(false)
  }

  const handleDisplayUnListConfirmModal = () => {
    setDisplayUnListConfirmNftModal(true)
  }

  const handleHideUnListConfirmModal = () => {
    setDisplayUnListConfirmNftModal(false)
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
          {cosmons.map((cosmon, i) => (
            <div
              key={`${i}-${cosmon.id}`}
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
      {displayListConfirmNftModal && selectedCosmon ? (
        <ListConfirmNftModal
          cosmon={selectedCosmon}
          handleCloseModal={handleHideListConfirmModal}
        />
      ) : null}
      {displayUnlistNftModal && selectedCosmon ? (
        <UnlistNftModal
          cosmon={selectedCosmon}
          handleCloseModal={handleHideUnlistModal}
          handleSubmitUnlistNft={handleSubmitUnlistNft}
        />
      ) : null}
      {displayUnListConfirmNftModal && selectedCosmon ? (
        <UnlistConfirmNftModal
          cosmon={selectedCosmon}
          handleCloseModal={handleHideUnListConfirmModal}
        />
      ) : null}
    </>
  )
}

export default CosmonsList
