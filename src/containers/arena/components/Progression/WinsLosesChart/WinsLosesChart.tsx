import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { WalletInfos } from 'types'
import * as style from './WinsLosesChart.module.scss'

ChartJS.register(ArcElement, Tooltip)

interface Props {
  walletInfos: WalletInfos
}

const WinsLosesChart: React.FC<Props> = ({ walletInfos }) => {
  const data = {
    labels: ['Victories', 'Defeats'],
    datasets: [
      {
        backgroundColor: ['#5E43EA', '#F6BD16'],
        borderColor: ['#5E43EA', '#F6BD16'],
        data: [walletInfos.victories, walletInfos.defeats],
      },
    ],
  }
  return (
    <div className={style.container}>
      <div className={style.doughnutContent}>
        <Doughnut
          className={style.doughnut}
          data={data}
          options={{
            cutout: 50,
            responsive: true,
            maintainAspectRatio: true,
          }}
        />
      </div>
      <div className={style.legendContent}>
        <div className={style.victoryLine}>
          <div className={style.victoryIcon} />
          <span className={style.legendLabel}>Victories</span>
          <span className={style.value}>{walletInfos.victories}</span>
        </div>
        <div className={style.defeatLine}>
          <div className={style.defeatIcon} />
          <span className={style.legendLabel}>Defeats</span>
          <span className={style.value}>{walletInfos.defeats}</span>
        </div>
      </div>
    </div>
  )
}

WinsLosesChart.displayName = 'WinsLosesChart'

export default WinsLosesChart
