import Button from '@components/Button/Button'
import Modal from '@components/Modal/Modal'
import { Deck } from '@services/deck'
import React from 'react'

interface DeleteDeckModalProps {
  deck: Deck
  loading: boolean
  onConfirmDelete: () => void
  onCloseModal: () => void
}

const DeleteDeckModal: React.FC<DeleteDeckModalProps> = ({
  deck,
  loading,
  onConfirmDelete,
  onCloseModal,
}) => {
  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton={false}>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl font-semibold text-white">
          Would you like to delete this deck?
        </p>
        <div className="mt-[32px] flex rounded-[20px] bg-cosmon-main-primary/[.5] px-[40px] py-[24px]">
          <p className="text-sm font-normal leading-6 text-[#D4D4D4]">
            You won’t be able to play with it or retrieve any data.Your Cosmon
            NFT will be released and available to be added in new decks.
          </p>
        </div>
        <div className="mt-[40px] flex gap-[40px]">
          <Button
            type="secondary"
            size="small"
            onClick={onConfirmDelete}
            isLoading={loading}
          >
            Delete it
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={onCloseModal}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteDeckModal
