import { useArenaStore } from '@store/arenaStore'
import { useWalletStore } from '@store/walletStore'
import React, { useEffect } from 'react'
import { ArenaType } from 'types/Arena'
import ClaimBanner from './ClaimBanner/ClaimBanner'
import EarningsAndScore from './EarningsAndScore/EarningsAndScore'
import Leaderboard from './LeaderBoard/Leaderboard'
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
    fetchPrizesForAddress,
  } = useArenaStore()

  const { address } = useWalletStore()

  useEffect(() => {
    try {
      fetchWalletInfos(currentLeaguePro.contract, address)
      fetchCurrentLeaderBoard(currentLeaguePro.contract)
      fetchPrizesForAddress(currentLeaguePro.contract)
    } catch (error) {}
  }, [currentLeaguePro])

  console.log('walletInfos', walletInfos)
  console.log('currentLeaderboard', currentLeaderboard)
  console.log('oldLeaderboard', oldLeaderboard)
  console.log('prizesForAddress', prizesForAddress)

  return (
    <div className={style.progression}>
      {prizesForAddress.to_claim.length > 0 && <ClaimBanner prizesForAddress={prizesForAddress} />}
      <div className={style.cardsContainer}>
        <EarningsAndScore walletInfos={walletInfos} prizesForAddress={prizesForAddress} />
        <WinsLosesChart walletInfos={walletInfos} />
      </div>
      <div className={style.leaderboard}>
        <p className={style.leaderboardLabel}>Weekly Leaderboard</p>
        <Leaderboard
          currentWalletAddress={address}
          currentLeaderboard={currentLeaderboard}
          walletInfos={walletInfos}
        />
      </div>
    </div>
  )
}

export default Progression
