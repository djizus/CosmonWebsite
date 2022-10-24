import React, { Dispatch, SetStateAction } from 'react'
import Button from '@components/Button/Button'
import * as style from './BoostPicker.module.scss'
import { Boost } from 'types/Boost'
import clsx from 'clsx'
import { CurrentView } from '../BuyBoostModalType'
import IconWithLabel from '../IconWithLabel/IconWithLabel'
import { getIconForAttr } from '@utils/boost'

interface BoosterPickerProps {
  selectedBoost: Boost | null
  setSelectedBoost: Dispatch<SetStateAction<Boost | null>>
  setCurrentView: Dispatch<SetStateAction<CurrentView>>
}

const BoostPicker: React.FC<BoosterPickerProps> = ({
  selectedBoost,
  setSelectedBoost,
  setCurrentView,
}) => {
  const boostsAvailable: Boost[] = [
    {
      image_path: '/icons/yellow-gift.svg',
      effect_time: 5,
      name: 'Elixir',
      inc_value: 5,
      price: { denom: 'XKI', amount: '10' },
    },
    {
      image_path: '/icons/yellow-gift.svg',
      effect_time: 5,
      name: 'Megaelixir',
      inc_value: 5,
      price: { denom: 'XKI', amount: '15' },
    },
  ]

  return (
    <div className={style.container}>
      <p className={style.title}>Choose your Boost</p>
      <p className={style.subtitle}>
        Boosts are accessories that empowers your Cosmons.
        <br />
        10 fights per Boost・3 Boosts per Leader
      </p>
      <div className={style.content}>
        {boostsAvailable.map((boost) => {
          const Icon = getIconForAttr(boost.name)
          return (
            <div key={boost.name} className={style.boost}>
              <div className={style.leftBlock}>
                <Button
                  withoutContainer
                  className={clsx(style.boostButton, {
                    [style.selectedBoost]: boost.name === selectedBoost?.name,
                  })}
                  type="secondary"
                  onClick={() => setSelectedBoost(boost)}
                >
                  <img src={boost.image_path} />
                  <span>{boost.name}</span>
                </Button>
              </div>
              <div className={style.rightBlock}>
                <IconWithLabel Icon={Icon} label={`+${boost.inc_value}`} />
                <p className={style.price}>
                  {boost.price.amount} {boost.price.denom}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <Button disabled={!selectedBoost} onClick={() => setCurrentView('leader')}>
        Continue
      </Button>
    </div>
  )
}

BoostPicker.displayName = 'BoostPicker'

export default BoostPicker
