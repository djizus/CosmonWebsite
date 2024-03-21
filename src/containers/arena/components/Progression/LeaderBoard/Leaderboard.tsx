import clsx from 'clsx'
import { LeaderBoard, LeaderBoardItem, WalletInfos } from 'types/Arena'
import { isMyWalletInCurrentPage } from './utils'
import * as style from './Leaderboard.module.scss'
import Button from '@components/Button/Button'
import { useWindowSize } from 'react-use'
import {useEffect, useMemo} from 'react'
import { truncate } from '@utils/text'
import {useArenaStore} from "@store/arenaStore";
import {useGameStore} from "@store/gameStore";
import numeral from "numeral";
import {convertMicroDenomToDenom} from "@utils/conversion";

interface Props {
  currentWalletAddress: string
  currentLeaderboard: LeaderBoard
  walletInfos: WalletInfos
  isOldLeaderboard: boolean
  page: number
  itemPerPage: number
  handleChangePage: (value: number) => void
  className?: string
}

const Leaderboard: React.FC<Props> = ({
  currentLeaderboard,
  currentWalletAddress,
  walletInfos,
  isOldLeaderboard,
  page,
  itemPerPage,
  handleChangePage,
  className,
}) => {
  const { width } = useWindowSize()
  const isMobileOrTablet = useMemo(() => {
    if (width < 1024) {
      return true
    }
    return false
  }, [width])
  const displayMyWallet =
    !isMyWalletInCurrentPage(currentWalletAddress, currentLeaderboard) && !isOldLeaderboard
  const fights = walletInfos.victories + walletInfos.defeats + walletInfos.draws
  const slicedLeaderboard = currentLeaderboard.slice(0, 20)
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
    return `${parseFloat(reward.toFixed(0)).toLocaleString()} XKI`;
  };
  const prizepool = prizePool ? Math.trunc(convertMicroDenomToDenom(prizePool.amount)) : 0;

  return (
    <div className={style.container}>
      <hr className={style.firstHr} />
      <table className={clsx(style.table, className)}>
        <thead className={style.header}>
        <tr>
          <th className={style.headerCell}>Ranking</th>
          <th className={style.headerCell}>Player</th>
          <th className={clsx(style.headerCell, 'hidden lg:table-cell')}>Score</th>
          <th className={clsx(style.headerCell, 'hidden lg:table-cell')}>Fights</th>
          <th className={clsx(style.headerCell, 'hidden lg:table-cell')}>Victories</th>
          <th className={clsx(style.headerCell, 'hidden lg:table-cell')}>Draws</th>
          <th className={clsx(style.headerCell, 'hidden lg:table-cell')}>Defeats</th>
          <th className={clsx(style.headerCell, 'hidden lg:table-cell')}>Winrate</th>
          <th className={style.headerCell}>Reward</th>
        </tr>
        </thead>
        <tbody className={style.tbody}>
        {displayMyWallet && (
            <>
              <tr className={style.myWalletLine}>
                <td className={style.positionCell}>{walletInfos.position}</td>
                <td className={style.cell}>
                  {isMobileOrTablet ? truncate(currentWalletAddress, 11) : currentWalletAddress}
                </td>
                <td className={clsx(style.cell, 'hidden lg:table-cell')}>{walletInfos.points}</td>
                <td className={clsx(style.cell, 'hidden lg:table-cell')}>{fights}</td>
                <td className={clsx(style.cell, 'hidden lg:table-cell')}>
                  {walletInfos.victories}
                </td>
                <td className={clsx(style.cell, 'hidden lg:table-cell')}>{walletInfos.draws}</td>
                <td className={clsx(style.cell, 'hidden lg:table-cell')}>{walletInfos.defeats}</td>
                <td className={clsx(style.cell, 'hidden lg:table-cell')}>
                  {walletInfos.defeats + walletInfos.draws === 0 ? "100%" :
                      `${(walletInfos.victories / (fights) * 100).toFixed(2)}%`}
                </td>
                <td className={clsx(style.cell, style.cellAlignedRight)}>{walletInfos.position}</td>
              </tr>
              <tr className={style.line}>
                <td className={style.fakePositionCell}>...</td>
                <td className={style.fakeCosmonCell}>...</td>
                <td className={clsx(style.fakeCell, 'hidden lg:table-cell')}>...</td>
                <td className={clsx(style.fakeCell, 'hidden lg:table-cell')}>...</td>
                <td className={clsx(style.fakeCell, 'hidden lg:table-cell')}>...</td>
                <td className={clsx(style.fakeCell, 'hidden lg:table-cell')}>...</td>
                <td className={clsx(style.fakeCell, 'hidden lg:table-cell')}>...</td>
                <td className={clsx(style.fakeCell, 'hidden lg:table-cell')}>...</td>
                <td className={clsx(style.fakeCell, style.cellAlignedRight)}>...</td>
              </tr>
            </>
        )}
        {slicedLeaderboard.map((wallet: LeaderBoardItem) => (
            <tr
                key={wallet.address}
                className={clsx(style.line, {
                  [style.myWalletLine]: wallet.address === currentWalletAddress,
                })}
            >
              <td className={style.positionCell}>{wallet.position}</td>
              <td className={style.cell}>
                {isMobileOrTablet ? truncate(wallet.address, 11) : wallet.address}
              </td>
              <td className={clsx(style.cell, 'hidden lg:table-cell')}>{wallet.points}</td>
              <td className={clsx(style.cell, 'hidden lg:table-cell')}>{wallet.fights}</td>
              <td className={clsx(style.cell, 'hidden lg:table-cell')}>{wallet.victories}</td>
              <td className={clsx(style.cell, 'hidden lg:table-cell')}>{wallet.draws}</td>
              <td className={clsx(style.cell, 'hidden lg:table-cell')}>{wallet.defeats}</td>
              <td className={clsx(style.cell, 'hidden lg:table-cell')}>
                {walletInfos.defeats + walletInfos.draws === 0 ? "100%" :
                    `${(wallet.victories / (wallet.fights) * 100).toFixed(2)}%`}
              </td>
              <td className={clsx(style.cell, style.cellAlignedRight)}>
                {calculateRewardFormatted(wallet.position, prizepool)}
              </td>
            </tr>
        ))}
        </tbody>
      </table>
      <div className={style.leaderboardPagination}>
        <Button
            className={style.paginationButton}
            type="ghost"
            disabled={page === 0}
            onClick={() => handleChangePage(page - 1)}
        >
        Previous
        </Button>
        <Button
          type="ghost"
          className={style.paginationButton}
          disabled={currentLeaderboard.length < itemPerPage}
          onClick={() => handleChangePage(page + 1)}
        >
          Next
        </Button>
      </div>
      <hr className={style.hr} />
    </div>
  )
}

Leaderboard.displayName = 'Leaderboard'

export default Leaderboard
