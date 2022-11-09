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
import { getAmountFromDenom } from '@utils'
import { useWalletStore } from '@store/walletStore'

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
  const { coins } = useWalletStore((state) => state)

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

  const hasEnoughCoinsToBuy = (boost: Boost) => {
    const myWallet = getAmountFromDenom(process.env.NEXT_PUBLIC_STAKING_DENOM || '', coins)
    const cosmonPrice = convertMicroDenomToDenom(boost.price.amount)

    return myWallet > cosmonPrice
  }

  return (
    <div className={style.container}>
      <p className={style.title}>Choose your Boost</p>
      <p className={style.subtitle}>
        Boosts are accessories that empowers your Cosmons.
        <br />
        {boostsAvailable[0]?.effect_time} fights per Boost・3 Boosts per Leader
      </p>
      <div className={style.content}>
        {boostsAvailable.map((boost, index) => {
          const Icon = getIconForAttr(boost.boost_name)
          const hasEnoughCoins = hasEnoughCoinsToBuy(boost)

          return (
            <div key={`${boost.boost_name}-${index}`} className={style.boost}>
              <div className={style.leftBlock}>
                <div
                  data-for={`${boost.boost_name}-${index}`}
                  data-tip={`${boost.boost_name}-${index}`}
                >
                  <Button
                    withoutContainer
                    className={clsx(style.boostButton, {
                      [style.selectedBoost]: boost.boost_name === selectedBoost?.boost_name,
                    })}
                    type="secondary"
                    onClick={() => setSelectedBoost(boost)}
                    disabled={!hasEnoughCoins}
                  >
                    <img className={style.boostIcon} src={boost.image_path} />
                    <span>{getPotionNameFromBoostedStat(boost.boost_name)}</span>
                  </Button>
                </div>
                {!hasEnoughCoins ? (
                  <Tooltip id={`${boost.boost_name}-${index}`}>
                    <p>You don’t have enough XKI in your wallet.</p>
                  </Tooltip>
                ) : null}
              </div>
              <div className={style.rightBlock}>
                <div data-tip="tootlip" data-for={boost.boost_name}>
                  <IconWithLabel Icon={Icon} label={`+${boost.inc_value} %`} />
                </div>
                <Tooltip id={boost.boost_name}>
                  + {boost.inc_value} % {boost.boost_name.toUpperCase()}
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
