import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { CosmonType } from 'types'
import CosmonListItem from './CosmonListItem/CosmonListItem'
import * as style from './CosmonsList.module.scss'

interface CosmonsListProps {
  cosmons: CosmonType[]
  onClickShowDetails: (cosmon: CosmonType) => void
  className?: string
}

const CosmonsList: React.FC<CosmonsListProps> = ({ cosmons, onClickShowDetails, className }) => {
  return (
    <>
      <Transition show={true} appear={true}>
        <div
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(167px, max-content))',
          }}
          className={clsx(style.list, className)}
        >
          {cosmons.map((cosmon) => (
            <div
              key={cosmon.id}
              className="group overflow-visible transition-transform hover:scale-[104%]"
            >
              <CosmonListItem cosmon={cosmon} onClick={onClickShowDetails} />
            </div>
          ))}
        </div>
      </Transition>
    </>
  )
}

export default CosmonsList
