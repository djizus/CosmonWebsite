import Dropdown from '@components/Dropdown/Dropdown'
import { useArenaStore } from '@store/arenaStore'
import { useWalletStore } from '@store/walletStore'
import React, { useEffect, useState } from 'react'
import { ArenaType } from 'types/Arena'
import ClaimBanner from './ClaimBanner/ClaimBanner'
import EarningsAndScore from './EarningsAndScore/EarningsAndScore'
import Leaderboard from './LeaderBoard/Leaderboard'
import * as style from './Progression.module.scss'
import WinsLosesChart from './WinsLosesChart/WinsLosesChart'
import Select, { OptionType } from '@components/Input/Select'
import { fetchOldLeaderboard } from '@services/arena'

interface ProgressionProps {
  currentLeaguePro: ArenaType
}

type SelectedLeaderboardType = 'current' | 'old'

const selectedLeaderboardOptions: OptionType[] = [
  {
    label: 'Weekly leaderboard',
    value: 'current',
  },
  {
    label: 'Last week leaderboard',
    value: 'old',
  },
]

const Progression: React.FC<ProgressionProps> = ({ currentLeaguePro }) => {
  const {
    oldLeaderboard,
    currentLeaderboard,
    walletInfos,
    prizesForAddress,
    fetchCurrentLeaderBoard,
    fetchOldLeaderBoard,
    fetchWalletInfos,
    fetchPrizesForAddress,
    claimPrize,
    loading,
    fetchDailyCombat,
    fetchMaxDailyCombat,
    dailyCombatLimit,
    maxDailyCombatLimit,
  } = useArenaStore()

  const { address } = useWalletStore()

  const [selectedLeaderboard, setSelectedLeaderboard] = useState<SelectedLeaderboardType>('current')
  const [page, setPage] = useState(0)
  const [itemPerPage, setItemPerPage] = useState(20)

  useEffect(() => {
    try {
      fetchWalletInfos(currentLeaguePro.contract, address)
      fetchCurrentLeaderBoard(currentLeaguePro.contract, { page, itemPerPage, init: true })
      fetchPrizesForAddress(currentLeaguePro.contract)
      fetchOldLeaderBoard(currentLeaguePro.contract, {
        limit: itemPerPage,
        offset: page,
      })
      fetchDailyCombat(currentLeaguePro.contract, address)
      fetchMaxDailyCombat(currentLeaguePro.contract)
    } catch (error) {}
  }, [currentLeaguePro])

  useEffect(() => {
    setPage(0)
  }, [selectedLeaderboard])

  useEffect(() => {
    if (selectedLeaderboard === 'current') {
      fetchCurrentLeaderBoard(currentLeaguePro.contract, { page, itemPerPage, init: false })
    } else if (selectedLeaderboard === 'old') {
      fetchOldLeaderboard(currentLeaguePro.contract, itemPerPage, page * itemPerPage)
    }
  }, [page, itemPerPage, selectedLeaderboard])

  const handleClickClaimPrize = async () => {
    try {
      claimPrize(currentLeaguePro.contract)
    } catch (error) {}
  }

  return (
    <div className={style.progression}>
      {prizesForAddress.to_claim.length > 0 && (
        <ClaimBanner
          prizesForAddress={prizesForAddress}
          onClickClaim={handleClickClaimPrize}
          loading={loading}
        />
      )}
      <div className={style.cardsContainer}>
        <EarningsAndScore walletInfos={walletInfos} prizesForAddress={prizesForAddress} />
        <WinsLosesChart
          dailyCombatLimit={dailyCombatLimit}
          maxDailyCombatLimit={maxDailyCombatLimit}
          walletInfos={walletInfos}
        />
      </div>
      <div className={style.leaderboard}>
        {oldLeaderboard.length > 0 ? (
          <>
            <Select
              className={style.selectLeaderboard}
              selectOptionsClassName={style.selectOptionsLeaderboard}
              value={selectedLeaderboard}
              options={selectedLeaderboardOptions}
              placeholder=""
              onChange={(value) => setSelectedLeaderboard(value as SelectedLeaderboardType)}
            />
            <Leaderboard
              currentWalletAddress={address}
              currentLeaderboard={
                selectedLeaderboard === 'current' ? currentLeaderboard : oldLeaderboard
              }
              walletInfos={walletInfos}
              isOldLeaderboard={selectedLeaderboard === 'old'}
              page={page}
              itemPerPage={itemPerPage}
              handleChangePage={(value: number) => setPage(value)}
            />
          </>
        ) : (
          <>
            <p className={style.leaderboardLabel}>Weekly Leaderboard</p>
            <Leaderboard
              currentWalletAddress={address}
              currentLeaderboard={currentLeaderboard}
              walletInfos={walletInfos}
              isOldLeaderboard={selectedLeaderboard === 'old'}
              page={page}
              itemPerPage={itemPerPage}
              handleChangePage={(value: number) => setPage(value)}
            />
          </>
        )}
      </div>
    </div>
  )
}

Progression.displayName = 'Progression'

export default Progression
