import React, { Dispatch, SetStateAction } from 'react'
import Button from '@components/Button/Button'
import * as style from './LeaderPicker.module.scss'
import { Boost } from 'types/Boost'
import { getIconForAttr } from '@utils/boost'
import clsx from 'clsx'
import { CurrentView } from '../BuyBoostModalType'

interface LeaderPickerProps {
  selectedLeader: string
  selectedBoost: string
  setSelectedLeader: Dispatch<SetStateAction<string>>
  setCurrentView: Dispatch<SetStateAction<CurrentView>>
}

const LeaderPicker: React.FC<LeaderPickerProps> = ({
  selectedLeader,
  selectedBoost,
  setSelectedLeader,
  setCurrentView,
}) => {
  const boostsAvailable: Boost[] = [
    {
      image_path: '/icons/yellow-gift.svg',
      effect_time: 5,
      name: 'Power Plus',
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
      <p className={style.title}>Select the Leader</p>
      <div className={style.boostDetails}>
        {/* <IconWithLabel boost={boostsAvailable[0]} /> */}
        <div>
          <p>{boostsAvailable[0].effect_time} Fights</p>
        </div>
      </div>
      <div className={style.content}></div>
      <Button disabled={selectedBoost === ''} onClick={() => setCurrentView('leader')}>
        Continue
      </Button>
    </div>
  )
}

LeaderPicker.displayName = 'LeaderPicker'

export default LeaderPicker
