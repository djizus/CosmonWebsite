import Button from '@components/Button/Button'
import Modal from '@components/Modal/Modal'
import React from 'react'

interface SkipFightModalProps {
  onClickAccept: () => void
  onClickCancel: () => void
}

const SkipFightModal: React.FC<SkipFightModalProps> = ({ onClickAccept, onClickCancel }) => {
  return (
    <Modal
      onCloseModal={onClickCancel}
      hasCloseButton={false}
      containerClassname="max-w-[98vw] w-[98vw] lg:max-w-[700px] lg:w-[700px]"
    >
      <p className="text-lg text-white">Are you sure to skip the fight ? </p>

      <div className="mt-[20px] flex w-full flex-col gap-[8px] rounded-[20px] bg-[#282255] py-[20px] px-[40px]">
        <p className={'text-center text-sm font-normal'}>
          The fight will still happen, you will see the result in the leaderboard
        </p>
      </div>
      <div className="mt-[89px] flex justify-center">
        <Button size="small" type="secondary" onClick={onClickAccept}>
          Yes
        </Button>
        <Button size="small" type="secondary" onClick={onClickCancel}>
          No
        </Button>
      </div>
    </Modal>
  )
}

export default SkipFightModal
