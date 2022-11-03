import React from 'react'
import { useWindowSize } from 'react-use'
import * as style from './style.module.scss'

interface PrizePoolBreakdownProps {}

const PrizePoolBreakdown: React.FC<PrizePoolBreakdownProps> = ({}) => {
  const { width } = useWindowSize()
  return <>{width < 640 ? <PrizePoolBreakdownMobile /> : <PrizePoolBreakdownDesktop />}</>
}

export default PrizePoolBreakdown

const PrizePoolBreakdownDesktop = () => {
  return (
    <>
      <p className={style.tipTitle}>Prize pool breakdown</p>

      <div className={style.line}>
        <p className={style.tipText}>
          1.<span className={style.tipPercent}>20%</span>
        </p>
        <p className={style.tipText}>
          2.<span className={style.tipPercent}>10%</span>
        </p>
        <p className={style.tipText}>
          3.<span className={style.tipPercent}>5%</span>
        </p>
        <p className={style.tipText}>
          4-9.<span className={style.tipPercent}>2.5%</span>
        </p>
      </div>
      <div className={style.line}>
        <p className={style.tipText}>
          10-24.<span className={style.tipPercent}>0.50%</span>
        </p>
        <p className={style.tipText}>
          25-49.<span className={style.tipPercent}>0.30%</span>
        </p>
        <p className={style.tipText}>
          50-99.<span className={style.tipPercent}>0.25%</span>
        </p>
      </div>
      <div className={style.line}>
        <p className={style.tipText}>
          100-149.<span className={style.tipPercent}>0.20%</span>
        </p>
        <p className={style.tipText}>
          150-199.<span className={style.tipPercent}>0.150%</span>
        </p>
        <p className={style.tipText}>
          200-249.<span className={style.tipPercent}>0.100%</span>
        </p>
      </div>
    </>
  )
}
const PrizePoolBreakdownMobile = () => {
  return (
    <>
      <p className={style.tipTitle}>Prize pool breakdown</p>

      <div className={style.line}>
        <p className={style.tipText}>
          1.<span className={style.tipPercent}>20%</span>
        </p>
        <p className={style.tipText}>
          2.<span className={style.tipPercent}>10%</span>
        </p>
      </div>
      <div className={style.line}>
        <p className={style.tipText}>
          3.<span className={style.tipPercent}>5%</span>
        </p>
        <p className={style.tipText}>
          4-9.<span className={style.tipPercent}>2.5%</span>
        </p>
      </div>
      <div className={style.line}>
        <p className={style.tipText}>
          10-24.<span className={style.tipPercent}>0.50%</span>
        </p>
        <p className={style.tipText}>
          25-49.<span className={style.tipPercent}>0.30%</span>
        </p>
      </div>
      <div className={style.line}>
        <p className={style.tipText}>
          50-99.<span className={style.tipPercent}>0.25%</span>
        </p>
        <p className={style.tipText}>
          100-149.<span className={style.tipPercent}>0.20%</span>
        </p>
      </div>
      <div className={style.line}>
        <p className={style.tipText}>
          150-199.<span className={style.tipPercent}>0.150%</span>
        </p>
        <p className={style.tipText}>
          200-249.<span className={style.tipPercent}>0.100%</span>
        </p>
      </div>
    </>
  )
}
