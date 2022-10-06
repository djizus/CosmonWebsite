import DiamondIcon from '/public/icons/diamond.svg'
import AwardIcon from '/public/icons/award.svg'
import * as style from './EarningsAndScore.module.scss'

interface Props {}

const EarningsAndScore: React.FC<Props> = ({}) => {
  return (
    <div className={style.container}>
      <div className={style.earningsContent}>
        <div className={style.firstLine}>
          <div className={style.icon}>
            <DiamondIcon />
          </div>
          <span className={style.label}>Earnings</span>
        </div>
        <p className={style.value}>1,226.54</p>
        <p className={style.suffixe}>USDC</p>
      </div>
      <div className={style.scoreContent}>
        <div className={style.firstLine}>
          <div className={style.icon}>
            <AwardIcon />
          </div>
          <span className={style.label}>Your score</span>
        </div>
        <p className={style.value}>115,497</p>
        <p className={style.suffixe}>Points</p>
      </div>
    </div>
  )
}

EarningsAndScore.displayName = 'EarningsAndScore'

export default EarningsAndScore
