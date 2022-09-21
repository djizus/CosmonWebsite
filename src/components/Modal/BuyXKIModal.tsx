import Button from '@components/Button/Button'
import React from 'react'
import Modal, { ModalProps } from './Modal'

interface BuyXKIModalProps extends Omit<ModalProps, 'children'> {}

const BuyXKIModal: React.FC<BuyXKIModalProps> = ({ ...props }) => {
  return (
    <Modal {...props}>
      <div>
        <div>
          <p className="text-[22px] text-white">You don’t seem to have any XKI</p>
        </div>
        <div className="mt-[20px] flex w-full justify-center rounded-[20px] bg-[#282255] py-[20px] px-[40px]">
          <p className="text-sm font-normal">
            You’ll need XKI in order to play Cosmon and complete transactions. Don’t wait and get
            some on Osmosis!
          </p>
        </div>
        <div className="mt-[40px] flex justify-center gap-[40px]">
          <Button type="secondary" size="small" onClick={props.onCloseModal}>
            Later
          </Button>
          <a href="https://app.osmosis.zone/?from=ATOM&to=XKI" target="_blank">
            <Button type="primary" size="small">
              Buy XKI
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  )
}

export default BuyXKIModal
