import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import { CosmonsListType } from '@containers/my-assets'
import { useState } from 'react'
import { CosmonType } from 'types'
import CardDropDownMenu from '../../CardDropDownMenu/CardDropDownMenu'
import * as style from './CosmonListItem.module.scss'

interface CosmonListItemProps {
  cosmon: CosmonType
  onClick: (cosmon: CosmonType) => void
  onClickTransfer: (cosmon: CosmonType) => void
  onClickList: (cosmon: CosmonType) => void
  onClickUnlist: (cosmon: CosmonType) => void
  variation: CosmonsListType
}
const CosmonListItem: React.FC<CosmonListItemProps> = ({
  cosmon,
  onClickTransfer,
  onClickUnlist,
  onClickList,
  onClick,
  variation,
}) => {
  const [displayDropDown, setDisplayDropDown] = useState(false)
  const displayDropDownInAll = variation === 'all' && !cosmon.isInDeck && !cosmon.isListed
  const displayDropDownInListed = variation === 'listed' && !cosmon.isInDeck && cosmon.isListed
  const displayDropDownInAvailable =
    variation === 'available' && !cosmon.isInDeck && !cosmon.isListed
  const displayDropDownInEnrolled = variation === 'enrolled' && false

  const canDropDownBeDisplay =
    displayDropDownInAll ||
    displayDropDownInListed ||
    displayDropDownInAvailable ||
    displayDropDownInEnrolled

  return (
    <div
      onMouseEnter={() => setDisplayDropDown(true)}
      onMouseLeave={() => setDisplayDropDown(false)}
      className={style.cosmonListItem}
    >
      <CosmonCard
        cosmon={cosmon}
        showLevel
        showPersonality
        showScarcity
        showNationality
        size="md"
        onClick={() => {
          onClick(cosmon)
        }}
        containerStyle={{ height: 280, width: 167 }}
        className="cursor-pointer"
      />
      {displayDropDown && canDropDownBeDisplay ? (
        <CardDropDownMenu
          onClickList={onClickList}
          onClickUnlist={onClickUnlist}
          onClickTransfer={onClickTransfer}
          className={style.dropdown}
          cosmon={cosmon}
          variation={variation}
        />
      ) : null}
    </div>
  )
}

CosmonListItem.displayName = 'CosmonListItem'

export default CosmonListItem