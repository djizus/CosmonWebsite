import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import * as style from './WinsLosesChart.module.scss'

ChartJS.register(ArcElement, Tooltip)

interface Props {}

const data = {
  labels: ['Victories', 'Defeats'],
  datasets: [
    {
      label: 'test',
      backgroundColor: ['#F6BD16', '#5E43EA'],
      borderColor: ['#F6BD16', '#5E43EA'],
      data: [24, 27],
    },
  ],
}

const WinsLosesChart: React.FC<Props> = () => {
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
          <span className={style.value}>27</span>
        </div>
        <div className={style.defeatLine}>
          <div className={style.defeatIcon} />
          <span className={style.legendLabel}>Defeats</span>
          <span className={style.value}>24</span>
        </div>
      </div>
    </div>
  )
}

WinsLosesChart.displayName = 'WinsLosesChart'

export default WinsLosesChart
