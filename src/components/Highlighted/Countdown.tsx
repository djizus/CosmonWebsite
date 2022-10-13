import Countdown from '@components/Countdown/Countdown'
import { useArenaStore } from '@store/arenaStore'
import clsx from 'clsx'
import React from 'react'
import styles from './Countdown.module.scss'

interface HighlightedCountdownProps {}

const HighlightedCountdown: React.FC<HighlightedCountdownProps> = () => {
  const { getNextLeagueOpenTime } = useArenaStore()

  return (
    <div className={clsx(styles.countdownContainer)}>
      <div className="flex flex-col items-center justify-center">
        <Countdown from={new Date()} to={getNextLeagueOpenTime()} tag="h3" />
        <p className="mt-[23px] text-sm">Just a few days to wait to fight for the prize pool</p>
      </div>
    </div>
  )
}

export default HighlightedCountdown
