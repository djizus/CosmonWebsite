import React, { Dispatch, SetStateAction, useState } from 'react'
import Button from '@components/Button/Button'
import * as style from './BoostPicker.module.scss'
import { Boost } from 'types/Boost'
import clsx from 'clsx'
import {
  BuyBoostModalOrigin,
  CosmonTypeWithDecksAndBoosts,
  CurrentView,
} from '../BuyBoostModalType'
import IconWithLabel from '../IconWithLabel/IconWithLabel'
import { getIconForAttr, getPotionNameFromBoostedStat, getStatAcronymFromBoost } from '@utils/boost'
import Tooltip from '@components/Tooltip/Tooltip'
import { convertMicroDenomToDenom } from '@utils/conversion'
import { useGameStore } from '@store/gameStore'

interface BoosterPickerProps {
  selectedBoost: Boost | null
  selectedLeaders: CosmonTypeWithDecksAndBoosts[]
  setSelectedBoost: Dispatch<SetStateAction<Boost | null>>
  setCurrentView: Dispatch<SetStateAction<CurrentView>>
  origin: BuyBoostModalOrigin
  boostsAvailable: Boost[]
  handleCloseModal: () => void
}

const BoostPicker: React.FC<BoosterPickerProps> = ({
  selectedBoost,
  selectedLeaders,
  setSelectedBoost,
  setCurrentView,
  origin,
  boostsAvailable,
  handleCloseModal,
}) => {
  const [loading, setLoading] = useState(false)

  const { buyBoost } = useGameStore()

  const handleSubmit = async () => {
    setLoading(true)
    if (origin === 'buyBoost') {
      setCurrentView('leader')
    } else {
      if (selectedBoost) {
        await buyBoost(selectedLeaders[0], selectedBoost, handleCloseModal)
        setLoading(false)
        setCurrentView('recap')
      }
    }
  }

  return (
    <div className={style.container}>
      <p className={style.title}>Choose your Boost</p>
      <p className={style.subtitle}>
        Boosts are accessories that empowers your Cosmons.
        <br />
        10 fights per Boost・3 Boosts per Leader
      </p>
      <div className={style.content}>
        {boostsAvailable.map((boost, index) => {
          const Icon = getIconForAttr(boost.boost_name)

          return (
            <div key={`${boost.boost_name}-${index}`} className={style.boost}>
              <div className={style.leftBlock}>
                <Button
                  withoutContainer
                  className={clsx(style.boostButton, {
                    [style.selectedBoost]: boost.boost_name === selectedBoost?.boost_name,
                  })}
                  type="secondary"
                  onClick={() => setSelectedBoost(boost)}
                >
                  <img className={style.boostIcon} src={boost.image_path} />
                  <span>{getPotionNameFromBoostedStat(boost.boost_name)}</span>
                </Button>
              </div>
              <div className={style.rightBlock}>
                <div data-tip="tootlip" data-for={boost.boost_name}>
                  <IconWithLabel Icon={Icon} label={`+${boost.inc_value} %`} />
                </div>
                <Tooltip id={boost.boost_name}>
                  + {boost.inc_value} % {boost.boost_name}
                </Tooltip>
                <p className={style.price}>{convertMicroDenomToDenom(boost.price.amount)} XKI</p>
              </div>
            </div>
          )
        })}
      </div>
      <Button disabled={!selectedBoost} onClick={handleSubmit} isLoading={loading}>
        Continue
      </Button>
    </div>
  )
}

BoostPicker.displayName = 'BoostPicker'

export default BoostPicker
