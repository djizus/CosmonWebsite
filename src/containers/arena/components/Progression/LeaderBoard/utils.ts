import { LeaderBoard } from 'types'

const isMyWalletInCurrentPage = (myWalletAddres: string, leaderboard: LeaderBoard) => {
  const myWalletIndexInLeaderboard = leaderboard.findIndex(
    (item) => item.address === myWalletAddres
  )

  return myWalletIndexInLeaderboard !== -1
}

export { isMyWalletInCurrentPage }
