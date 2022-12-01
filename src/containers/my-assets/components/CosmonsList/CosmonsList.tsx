import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import Tooltip from '@components/Tooltip/Tooltip'
import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'
import { CosmonType } from 'types'

interface CosmonsListProps {
  cosmons: CosmonType[]
  onClickTransfer: (cosmon: CosmonType) => void
  onClickShowDetails: (cosmon: CosmonType) => void
  className?: string
}

const CosmonsList: React.FC<CosmonsListProps> = ({
  cosmons,
  onClickTransfer,
  onClickShowDetails,
  className,
}) => {
  return (
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
            <div
              onClick={() => {
                if (cosmon.isInDeck === false) {
                  onClickTransfer(cosmon)
                }
              }}
              data-tip="tootlip"
              data-for={`${cosmon.id}-transfer`}
              className={clsx(
                'transfer-card-icon absolute -top-4 -right-4 z-30 scale-0 rounded-full p-2 transition-transform group-hover:scale-100',
                cosmon.isInDeck === false ? 'cursor-pointer' : 'disabled cursor-not-allowed'
              )}
            >
              <img width="16px" height="16px" src="../icons/transfer-card.svg" alt="" />
            </div>
            <Tooltip id={`${cosmon.id}-transfer`} place="top">
              <p style={{ whiteSpace: 'pre' }}>
                {cosmon.isInDeck === false
                  ? 'Transfer your cosmon'
                  : 'Transfer impossible\nYour cosmon is already in a deck'}
              </p>
            </Tooltip>
            <CosmonCard
              cosmon={cosmon}
              showLevel
              showPersonality
              showScarcity
              showNationality
              size="md"
              onClick={() => {
                onClickShowDetails(cosmon)
              }}
              containerStyle={{ height: 280, width: 167 }}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>
    </Transition>
  )
}

export default CosmonsList
