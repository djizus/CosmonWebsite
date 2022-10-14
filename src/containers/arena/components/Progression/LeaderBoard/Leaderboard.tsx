import clsx from 'clsx'
import { CurrentLeaderBoard, CurrentLeaderBoardItem, WalletInfos } from 'types/Arena'
import { isMyWalletInCurrentPage } from './utils'
import * as style from './Leaderboard.module.scss'

interface Props {
  currentWalletAddress: string
  currentLeaderboard: CurrentLeaderBoard
  walletInfos: WalletInfos
  className?: string
}

const Leaderboard: React.FC<Props> = ({
  currentLeaderboard,
  currentWalletAddress,
  walletInfos,
  className,
}) => {
  const displayMyWallet = !isMyWalletInCurrentPage(currentWalletAddress, currentLeaderboard)
  const fights = walletInfos.victories + walletInfos.defeats + walletInfos.draws

  return (
    <div className={style.container}>
      <hr className={style.firstHr} />
      <table className={clsx(style.table, className)}>
        <thead className={style.header}>
          <tr>
            <th className={style.headerCell}>Ranking</th>
            <th className={style.headerCell}>Cosmon player</th>
            <th className={style.headerCell}>Fights</th>
            <th className={style.headerCell}>Victories</th>
            <th className={style.headerCell}>Draw Games</th>
            <th className={style.headerCell}>Defeats</th>
            <th className={style.headerCell}>Score</th>
          </tr>
        </thead>
        <tbody className={style.tbody}>
          {displayMyWallet && (
            <>
              <tr className={style.myWalletLine}>
                <td className={style.positionCell}>{walletInfos.position}</td>
                <td className={style.cell}>{currentWalletAddress}</td>
                <td className={style.cell}>{fights}</td>
                <td className={style.cell}>{walletInfos.victories}</td>
                <td className={style.cell}>{walletInfos.draws}</td>
                <td className={style.cell}>{walletInfos.defeats}</td>
                <td className={style.cell}>{walletInfos.points}</td>
              </tr>
              <tr className={style.line}>
                <td className={style.fakePositionCell}>...</td>
                <td className={style.fakeCosmonCell}>...</td>
                <td className={style.fakeCell}>...</td>
                <td className={style.fakeCell}>...</td>
                <td className={style.fakeCell}>...</td>
                <td className={style.fakeCell}>...</td>
              </tr>
            </>
          )}
          {currentLeaderboard.map((wallet: CurrentLeaderBoardItem) => (
            <tr
              key={wallet.address}
              className={clsx(style.line, {
                [style.myWalletLine]: wallet.address === currentWalletAddress,
              })}
            >
              <td className={style.positionCell}>{wallet.position}</td>
              <td className={style.cell}>{wallet.address}</td>
              <td className={style.cell}>{wallet.fights}</td>
              <td className={style.cell}>{wallet.victories}</td>
              <td className={style.cell}>{wallet.draws}</td>
              <td className={style.cell}>{wallet.defeats}</td>
              <td className={style.cell}>{wallet.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className={style.hr} />
    </div>
  )
}

Leaderboard.displayName = 'Leaderboard'

export default Leaderboard
