import Button from '@components/Button/Button'
import Modal from '@components/Modal/Modal'
import React, { useCallback, useState } from 'react'
import { FightModeType } from 'types/FightMode'
import { getFightRequestModes } from '../data'
import Shield from '@public/cosmons/stats/shield.svg'
import clsx from 'clsx'
import Tooltip from '@components/Tooltip/Tooltip'

interface FightRequestModalProps {
  loading?: boolean
  onConfirmFight: (selectedFightModeType: FightModeType) => void
  onCloseModal: () => void
}

const fightRequestModes = getFightRequestModes()

const FightRequestModal: React.FC<FightRequestModalProps> = ({
  loading,
  onConfirmFight,
  onCloseModal,
}) => {
  const [selectedFightModeType, setSelectedFightModeType] = useState<
    FightModeType | undefined
  >()

  const handleSelectFightMode = useCallback((fightModeType: FightModeType) => {
    setSelectedFightModeType(fightModeType)
  }, [])

  const handleClickConfirmFight = useCallback(() => {
    if (selectedFightModeType) {
      onConfirmFight(selectedFightModeType)
      onCloseModal()
    }
  }, [selectedFightModeType])

  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton={false}>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl font-semibold text-white">Fight Request</p>

        <div
          className={clsx(
            'relative mt-[32px] flex cursor-pointer flex-col rounded-[20px] border border-[#9FA4DD] px-[40px] py-[24px] hover:bg-[#282255]',
            { 'bg-[#282255]': selectedFightModeType === 'training' },
            {
              'bg-transparent':
                !selectedFightModeType || selectedFightModeType !== 'training',
            }
          )}
          onClick={() => {
            handleSelectFightMode('training')
          }}
        >
          <div className="flex items-center justify-center gap-[14px]">
            <span className="flex items-center justify-center rounded-[4px] bg-white p-[6px]">
              <Shield />
            </span>
            <span className="text-xl font-normal leading-6 text-white">
              <span className="font-semibold">Training</span>
              &nbsp;
              <span>Mode</span>
            </span>
          </div>
          <p className="mt-[16px] text-sm font-normal leading-6 text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div
          className={clsx(
            'relative mt-[32px] flex cursor-not-allowed flex-col rounded-[20px] px-[40px] py-[24px] '
            /* { 'bg-[#282255]': selectedFightModeType === 'league' },
            {
              'bg-transparent':
                !selectedFightModeType || selectedFightModeType !== 'league',
            } */
          )}
          onClick={() => {
            // handleSelectFightMode('league')
          }}
        >
          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-[20px] bg-[#383856]/[0.9] backdrop-blur-[2px] ">
            <p
              className="text-3xl font-semibold text-white"
              style={{ transform: 'rotate(349deg)' }}
            >
              Coming soon
            </p>
          </div>

          <div className="flex items-center justify-center gap-[14px]">
            <span className="flex items-center justify-center rounded-[4px] bg-white p-[6px]">
              <Shield />
            </span>
            <span className="text-xl font-normal leading-6 text-white">
              <span className="font-semibold">Professional</span>
              &nbsp;
              <span>Leagues</span>
            </span>
          </div>
          <p className="mt-[16px] text-sm font-normal leading-6 text-white">
            You won’t be able to play with it or retrieve any data.Your Cosmon
            NFT will be released and available to be added in new decks.
          </p>
        </div>

        <div
          className="mt-[40px] flex gap-[40px]"
          data-tip="tootlip"
          data-for={'select-fight-mode'}
        >
          <Button
            type="primary"
            size="small"
            onClick={handleClickConfirmFight}
            disabled={selectedFightModeType === undefined}
          >
            Fight
          </Button>
        </div>
        {selectedFightModeType === undefined ? (
          <Tooltip id={'select-fight-mode'} place="top">
            <p>You must select a fight mode</p>
          </Tooltip>
        ) : null}
      </div>
    </Modal>
  )
}

export default FightRequestModal
