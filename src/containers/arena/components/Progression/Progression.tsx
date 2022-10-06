import { useArenaStore } from '@store/arenaStore'
import React, { useEffect } from 'react'
import { ArenaType } from 'types/Arena'
import EarningsAndScore from './EarningsAndScore/EarningsAndScore'
import * as style from './Progression.module.scss'
import WinsLosesChart from './WinsLosesChart/WinsLosesChart'

interface ProgressionProps {
  currentLeaguePro: ArenaType
}

const Progression: React.FC<ProgressionProps> = ({ currentLeaguePro }) => {
  const {
    oldLeaderboard,
    currentLeaderboard,
    walletInfos,
    prizesForAddress,
    fetchCurrentLeaderBoard,
    fetchWalletInfos,
    fetchOldLeaderBoard,
    fetchPrizesForAddress,
  } = useArenaStore()

  useEffect(() => {
    try {
      fetchWalletInfos(currentLeaguePro.contract)
      // fetchCurrentLeaderBoard(currentLeaguePro.contract)
      // fetchOldLeaderBoard(currentLeaguePro.contract)
      fetchPrizesForAddress(currentLeaguePro.contract)
    } catch (error) {}
  }, [currentLeaguePro])

  console.log('walletInfos', walletInfos)
  console.log('currentLeaderboard', currentLeaderboard)
  console.log('oldLeaderboard', oldLeaderboard)
  console.log('prizesForAddress', prizesForAddress)

  return (
    <div className="min-h-[400px]">
      <div className={style.cardContainer}>
        <EarningsAndScore />
        <WinsLosesChart />
      </div>
      <div className={style.leaderboard}>
        <div>LEADERBOARD</div>
      </div>
    </div>
  )
}

export default Progression
