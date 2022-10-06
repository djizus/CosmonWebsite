import { CurrentLeaderBoard } from 'types'

const isMyWalletInCurrentPage = (myWalletAddres: string, leaderboard: CurrentLeaderBoard) => {
  const myWalletIndexInLeaderboard = leaderboard.findIndex(
    (item) => item.address === myWalletAddres
  )

  return myWalletIndexInLeaderboard !== -1
}

export { isMyWalletInCurrentPage }
