import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import CosmonStatsCard from '@components/Cosmon/CosmonCard/CosmonStatsCard'
import FlipCard from '@components/FlipCard/FlipCard'
import { useState } from 'react'
import { CosmonMarketPlaceType, CosmonType, KiInformationResponse } from 'types'
import * as style from './CosmonListItem.module.scss'
import FlipIcon from '@public/icons/flip.svg'
import Button from '@components/Button/Button'

interface CosmonListItemProps {
  cosmon: CosmonMarketPlaceType
  onClick: (cosmon: CosmonMarketPlaceType) => void
}
const CosmonListItem: React.FC<CosmonListItemProps> = ({ cosmon, onClick }) => {
  const [displayFlip, setDisplayFlip] = useState(false)
  const [revealed, setRevealed] = useState(true)

  const handleClickFlip = () => {
    setRevealed(!revealed)
  }

  return (
    <div
      onMouseEnter={() => setDisplayFlip(true)}
      onMouseLeave={() => setDisplayFlip(false)}
      className={style.cosmonListItem}
    >
      <div className={style.cardContainer}>
        {displayFlip ? (
          <Button onClick={handleClickFlip} className={style.flipButton} withoutContainer>
            <FlipIcon className={style.flip} />
          </Button>
        ) : null}
        <FlipCard
          card={
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
              className={style.cosmonCard}
            />
          }
          cardBack={<CosmonStatsCard cosmon={cosmon} />}
          revealed={revealed}
        />
      </div>
      <div className={style.cosmonListItemFooter}>
        <p className={style.label}>Cosmon #{cosmon.id}</p>
        <div className={style.priceContainer}>
          <img className={style.kiLogo} src="../icons/xki.png" alt="" />
          <span className={style.priceValue}>{cosmon.price}</span>
        </div>
      </div>
    </div>
  )
}

CosmonListItem.displayName = 'CosmonListItem'

export default CosmonListItem
