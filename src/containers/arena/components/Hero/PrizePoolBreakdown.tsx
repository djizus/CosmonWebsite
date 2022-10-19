import React from 'react'
import * as style from './style.module.scss'

interface PrizePoolBreakdownProps {}

const PrizePoolBreakdown: React.FC<PrizePoolBreakdownProps> = ({}) => {
  return (
    <div>
      <p className={style.tipTitle}>Prize pool breakdown</p>
      <div className={style.line}>
        <p className={style.tipFirstText}>
          1.<span className={style.tipPercent}>50%</span>
        </p>
        <p className={style.tipSecondText}>
          2.<span className={style.tipPercent}>10%</span>
        </p>
        <p className={style.tipText}>
          3.<span className={style.tipPercent}>5%</span>
        </p>
      </div>
      <div className={style.line}>
        <p className={style.tipFourthText}>
          4.<span className={style.tipPercent}>3%</span>
        </p>
        <p className={style.tipFifthText}>
          5.<span className={style.tipPercent}>2%</span>
        </p>
        <p className={style.tipText}>
          6 - 200.<span className={style.tipPercent}>0.15%</span>
        </p>
      </div>
    </div>
  )
}

export default PrizePoolBreakdown
