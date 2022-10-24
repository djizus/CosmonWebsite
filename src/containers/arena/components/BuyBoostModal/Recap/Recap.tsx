import { Boost } from 'types/Boost'
import IconWithLabel from '../IconWithLabel/IconWithLabel'
import * as style from './Recap.module.scss'
import Flash from '@public/cosmons/stats/flash.svg'
import { getIconForAttr, getStatNameFromBoost } from '@utils/boost'
import Button from '@components/Button/Button'
import { CosmonType } from 'types/Cosmon'
import clsx from 'clsx'
import CardsWithStats from '../CardWithStats/CardWithStats'

interface Props {
  selectedLeader: CosmonType
  selectedBoost: Boost
  closeModal: () => void
  resetModal: () => void
}

const Recap: React.FC<Props> = ({ selectedBoost, selectedLeader, closeModal, resetModal }) => {
  const BoostIcon = getIconForAttr(selectedBoost.name)

  return (
    <div className={style.container}>
      <p className={style.title}>Recap</p>
      <div className={style.boostDetails}>
        <IconWithLabel Icon={BoostIcon} label={`+${selectedBoost.inc_value}`} />
        <IconWithLabel
          className={style.numberOfFights}
          Icon={() => <Flash />}
          label={`${selectedBoost.effect_time} Fights`}
        />
        <div className={style.price}>
          <img className={style.kiLogo} src="/xki-logo.png" style={{ width: 30, height: 30 }} />
          <span>
            {selectedBoost.price.amount} {selectedBoost.price.denom}
          </span>
        </div>
      </div>
      <div className={style.content}>
        <CardsWithStats
          className={clsx(style.card)}
          cosmon={selectedLeader}
          boost={selectedBoost}
        />
      </div>
      <p className={style.text}>
        {selectedLeader.data.extension.name} just boosted his{' '}
        {getStatNameFromBoost(selectedBoost.name)} by {selectedBoost.inc_value} points!
        <br /> This potion will last {selectedBoost.effect_time} fights before disappearing.
      </p>
      <div className={style.footer}>
        <Button onClick={closeModal} type="white">
          Close
        </Button>
        <Button onClick={resetModal}>Buy a new potion</Button>
      </div>
    </div>
  )
}

Recap.displayName = 'Recap'

export default Recap
