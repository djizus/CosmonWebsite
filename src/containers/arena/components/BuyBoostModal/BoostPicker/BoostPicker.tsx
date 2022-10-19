import React, { Dispatch, SetStateAction } from 'react'
import Button from '@components/Button/Button'
import * as style from './BoostPicker.module.scss'

interface BoosterPickerProps {
  selectedBoost: string
  setSelectedBoost: Dispatch<SetStateAction<string>>
}

const BoostPicker: React.FC<BoosterPickerProps> = ({ selectedBoost, setSelectedBoost }) => {
  const boostsAvailable = [
    {
      img: '/public/icons/yellow-gift.svg',
      label: 'Elixir',
      attrIcon: '/public/icons/info.svg',
      value: 5,
      price: 10,
    },
    {
      img: '/public/icons/yellow-gift.svg',
      label: 'Megaelixir',
      attrIcon: '/public/icons/info.svg',
      value: 10,
      price: 15,
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
        {boostsAvailable.map((boost) => (
          <div className={style.boost}>
            <div className={boost.leftBlock}>
              <Button
                active={boost.label === selectedBoost}
                type="secondary"
                className={style.boostButton}
              >
                <img src={boost.img} />
                <span>{boost.label}</span>
              </Button>
            </div>
            <div className={style.rightBlock}>
              <div className={style.attrContent}>
                <img src={boost.attrIcon} />
                <span>{boost.value}</span>
              </div>
              <p>{boost.price} XKI</p>
            </div>
          </div>
        ))}
      </div>
      <Button disabled={selectedBoost === ''}>Continue</Button>
    </div>
  )
}

BoostPicker.displayName = 'BoostPicker'

export default BoostPicker
