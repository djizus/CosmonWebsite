import Dropdown from '@components/Dropdown/Dropdown'
import React, { useMemo } from 'react'
import DotsHorizontal from '@public/icons/dots-horizontal.svg'
import { CosmonType } from 'types'
import * as style from './CardDropDownMenu.module.scss'
import clsx from 'clsx'
import { CosmonsListType } from '@containers/my-assets'

interface CardDropDownMenuProps {
  cosmon: CosmonType
  onClickTransfer: (cosmon: CosmonType) => void
  onClickList: (cosmon: CosmonType) => void
  onClickUnlist: (cosmon: CosmonType) => void
  variation: CosmonsListType
  className?: string
}

const CardDropDownMenu: React.FC<CardDropDownMenuProps> = ({
  cosmon,
  onClickTransfer,
  onClickList,
  onClickUnlist,
  variation,
  className,
}) => {
  if (variation === 'enrolled') {
    return null
  }

  const handleTransfer = () => {
    if (cosmon.isInDeck === false) {
      onClickTransfer(cosmon)
    }
  }

  const handleListNft = () => {
    if (cosmon.isInDeck === false) {
      onClickList(cosmon)
    }
  }

  const variationToDisplayListItem: CosmonsListType[] = ['all', 'available']
  const displayListItem = !cosmon.isListed && variationToDisplayListItem.includes(variation)

  const variationToDisplayUnListItem: CosmonsListType[] = ['all', 'listed']
  const displayUnListItem = cosmon.isListed && variationToDisplayUnListItem.includes(variation)

  const variationToDisplayTransfer: CosmonsListType[] = ['all', 'available']
  const displayTransferItem =
    !cosmon.isListed && !cosmon.isInDeck && variationToDisplayTransfer.includes(variation)

  return (
    <Dropdown className={clsx(className)}>
      <Dropdown.Toggler className={style.dotsIconContainer}>
        <DotsHorizontal className={style.dotsIcon} />
      </Dropdown.Toggler>
      <Dropdown.Menu className={style.menu}>
        {displayListItem ? (
          <Dropdown.MenuItem
            className={clsx(style.menuItem, {
              [style.disabled]: cosmon.isInDeck,
            })}
            onClick={handleListNft}
          >
            <p className="text-sm ">List for sale</p>
          </Dropdown.MenuItem>
        ) : null}
        {displayUnListItem ? (
          <Dropdown.MenuItem
            className={clsx(style.menuItem, {
              [style.disabled]: cosmon.isInDeck,
            })}
            onClick={() => onClickUnlist(cosmon)}
          >
            <p className="text-sm ">Cancel listing</p>
          </Dropdown.MenuItem>
        ) : null}
        {displayTransferItem ? (
          <Dropdown.MenuItem
            className={clsx(style.menuItem, {
              [style.disabled]: cosmon.isInDeck,
            })}
            onClick={handleTransfer}
          >
            <p className={clsx('text-sm ')}>
              {cosmon.isInDeck === false ? 'Transfer your cosmon' : 'Transfer impossible'}
            </p>
          </Dropdown.MenuItem>
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  )
}

CardDropDownMenu.displayName = 'CardDropDownMenu'

export default CardDropDownMenu
