import Button from '@components/Button/Button'
import { itemPerPage, MarketPlaceListType } from '@containers/marketplace'
import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { CosmonType } from 'types'
import CosmonListItem from './CosmonListItem/CosmonListItem'
import * as style from './CosmonsList.module.scss'

interface CosmonsListProps {
  cosmons: CosmonType[]
  page: number
  section: MarketPlaceListType
  onChangePage: (value: number) => void
  onClickShowDetails: (cosmon: CosmonType) => void
  isListLoading: boolean
  className?: string
}

const CosmonsList: React.FC<CosmonsListProps> = ({
  cosmons,
  page,
  section,
  onChangePage,
  onClickShowDetails,
  isListLoading,
  className,
}) => {
  return (
    <div className={clsx(style.listContainer, className)}>
      <Transition show={true} appear={true}>
        <div
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(167px, max-content))',
          }}
          className={style.list}
        >
          {cosmons.length > 0 ? (
            cosmons.map((cosmon) => (
              <div
                key={cosmon.id}
                className="group overflow-visible transition-transform hover:scale-[104%]"
              >
                <CosmonListItem cosmon={cosmon} onClick={onClickShowDetails} />
              </div>
            ))
          ) : (
            <div className={style.emptyContainer}>
              <img className={style.emptyBackground} src="/hold-and-earn/cards-background.png" />
              <p className={style.emptyText}>
                Oops, there are no cards for sale at the
                <br />
                moment, come back later!
              </p>
            </div>
          )}
        </div>
      </Transition>
      {section === 'all' && cosmons.length > 0 ? (
        <div className={style.paginationContainer}>
          <Button
            type="ghost"
            className={style.paginationButton}
            disabled={
              cosmons.slice(itemPerPage * page, itemPerPage * page + itemPerPage).length <
              itemPerPage
            }
            onClick={() => onChangePage(page + 1)}
            isLoading={isListLoading}
          >
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default CosmonsList
