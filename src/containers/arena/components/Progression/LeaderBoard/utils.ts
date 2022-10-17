import { LeaderBoard } from 'types'

const isMyWalletInCurrentPage = (myWalletAddres: string, leaderboard: LeaderBoard) => {
  const myWalletIndexInLeaderboard = leaderboard
    ?.slice(0, 5)
    .findIndex((item) => item.address === myWalletAddres)

  return myWalletIndexInLeaderboard !== -1
}

export { isMyWalletInCurrentPage }
