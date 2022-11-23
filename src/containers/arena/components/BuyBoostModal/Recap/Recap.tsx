import { Boost } from 'types/Boost'
import IconWithLabel from '../IconWithLabel/IconWithLabel'
import * as style from './Recap.module.scss'
import Flash from '@public/cosmons/stats/flash.svg'
import { getIconForAttr } from '@utils/boost'
import Button from '@components/Button/Button'
import clsx from 'clsx'
import CardsWithStats from '../CardWithStats/CardWithStats'
import { convertMicroDenomToDenom } from '@utils/conversion'
import { useEffect } from 'react'
import { useWalletStore } from '@store/walletStore'
import { BuyBoostModalOrigin, CosmonTypeWithDecks } from '../BuyBoostModalType'

interface Props {
  selectedLeaders: CosmonTypeWithDecks[]
  selectedBoost: Boost
  closeModal: () => void
  resetModal: () => void
  origin: BuyBoostModalOrigin
}

const Recap: React.FC<Props> = ({
  selectedBoost,
  selectedLeaders,
  closeModal,
  resetModal,
  origin,
}) => {
  const BoostIcon = getIconForAttr(selectedBoost.boost_name)
  const { fetchCosmons } = useWalletStore()

  useEffect(() => {
    fetchCosmons()
  }, [])

  return (
    <div className={style.container}>
      <p className={style.title}>Recap</p>
      <div className={style.boostDetails}>
        <IconWithLabel Icon={BoostIcon} label={`+${selectedBoost.inc_value} %`} />
        <IconWithLabel
          className={style.numberOfFights}
          Icon={() => <Flash />}
          label={`${selectedBoost.effect_time} Fights`}
        />
        <div className={style.price}>
          <img className={style.kiLogo} src="/xki-logo.png" style={{ width: 30, height: 30 }} />
          <span>
            {Math.round(
              convertMicroDenomToDenom(selectedBoost.price.amount) * selectedLeaders.length * 10
            ) / 10}{' '}
            XKI
          </span>
        </div>
      </div>
      <div className={style.content}>
        {selectedLeaders.map((selectedLeader) => (
          <CardsWithStats
            key={selectedLeader.id}
            className={clsx(style.card)}
            cosmon={selectedLeader}
            boost={selectedBoost}
            variation="recap"
          />
        ))}
      </div>
      {selectedLeaders.length <= 1 ? (
        <p className={style.text}>
          {selectedLeaders[0].data.extension.name} just boosted his{' '}
          {selectedBoost.boost_name.toUpperCase()} by {selectedBoost.inc_value} %!
          <br /> This potion will last {selectedBoost.effect_time} fights before disappearing.
        </p>
      ) : (
        <p className={style.text}>
          Your leaders just boosted their {selectedBoost.boost_name} by {selectedBoost.inc_value} %!
          <br /> Those potions will last {selectedBoost.effect_time} fights before disappearing.
        </p>
      )}
      <div className={style.footer}>
        <Button onClick={closeModal} type="white">
          Close
        </Button>
        <Button
          disabled={selectedLeaders[0].boosts[2] !== null && origin !== 'buyBoost'}
          onClick={resetModal}
        >
          Buy a new potion
        </Button>
      </div>
    </div>
  )
}

Recap.displayName = 'Recap'

export default Recap
