import DiamondIcon from '/public/icons/diamond.svg'
import AwardIcon from '/public/icons/award.svg'
import * as style from './EarningsAndScore.module.scss'
import { PrizesForAddress, WalletInfos } from 'types'
import { convertMicroDenomToDenom } from '@utils/conversion'
import numeral from 'numeral'
import {useArenaStore} from "@store/arenaStore";

interface Props {
  walletInfos: WalletInfos
  prizesForAddress: PrizesForAddress
}

const EarningsAndScore: React.FC<Props> = ({ walletInfos, prizesForAddress }) => {
  const {
    prizePool,
  } = useArenaStore()
  const calculateRewardFormatted = (position: number, prizepool: number): string => {
    let reward = 0;
    console.log(prizepool)
    if (position === 1) {
      reward = prizepool * 20 / 100;
    } else if (position === 2) {
      reward = prizepool * 10 / 100;
    } else if (position === 3) {
      reward = prizepool * 5 / 100;
    } else if (position >= 4 && position <= 9) {
      reward = prizepool * 2.5 / 100;
    } else if (position >= 10 && position <= 24) {
      reward = prizepool * 0.5 / 100;
    } else if (position >= 25 && position <= 49) {
      reward = prizepool * 0.3 / 100;
    } else if (position >= 50 && position <= 99) {
      reward = prizepool * 0.25 / 100;
    } else if (position >= 100 && position <= 149) {
      reward = prizepool * 0.2 / 100;
    } else if (position >= 150 && position <= 199) {
      reward = prizepool * 0.15 / 100;
    } else if (position >= 200 && position <= 249) {
      reward = prizepool * 0.1 / 100;
    } else if (position > 249) {
      reward = 0;
    }

    // Formatage du nombre avec des séparateurs de milliers et ajout de " XKI"
    return `${parseFloat(reward.toFixed(0)).toLocaleString()}`;
  };
  const prizepool = prizePool ? Math.trunc(convertMicroDenomToDenom(prizePool.amount)) : 0;
  return (
    <div className={style.container}>
      <div className={style.earningsContent}>
        <div className={style.firstLine}>
          <div className={style.icon}>
            <DiamondIcon />
          </div>
          <span className={style.label}>Total earnings</span>
        </div>
        <p className={style.value}>
          {prizesForAddress.total.length > 0
            ? numeral(convertMicroDenomToDenom(prizesForAddress.total[0].amount)).format('0,0')
            : 0}
        </p>
        <p className={style.suffixe}>XKI</p>
      </div>
      <div className={style.scoreContent}>
        <div className={style.firstLine}>
          <div className={style.icon}>
            <AwardIcon />
          </div>
          <span className={style.label}>Current earnings</span>
        </div>
        <p className={style.value}>
          {calculateRewardFormatted(walletInfos.position ?? 0, prizepool ?? 0)}
        </p>
        <p className={style.suffixe}>XKI</p>
      </div>
    </div>
  )
}

EarningsAndScore.displayName = 'EarningsAndScore'

export default EarningsAndScore
