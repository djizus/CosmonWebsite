import Countdown from '@components/Countdown/Countdown'
import { useArenaStore } from '@store/arenaStore'
import { sleep } from '@utils/sleep'
import clsx from 'clsx'
import React, { useState } from 'react'
import styles from './Countdown.module.scss'

interface HighlightedCountdownProps {}

const HighlightedCountdown: React.FC<HighlightedCountdownProps> = () => {
  const { getNextLeagueOpenTime } = useArenaStore()
  const [time, setTime] = useState<Date | undefined>(getNextLeagueOpenTime())

  const refreshTime = async () => {
    setTime(undefined)
    await sleep(1000)
    setTime(getNextLeagueOpenTime())
  }

  return (
    <div className={clsx(styles.countdownContainer)}>
      <div className="flex flex-col items-center justify-center">
        {time ? (
          <Countdown from={new Date()} to={time} onCountdownReached={refreshTime} tag="h3" />
        ) : (
          <h3>00</h3>
        )}
        <p className="mt-[23px] text-sm">Just a few days to wait to fight for the prize pool</p>
      </div>
    </div>
  )
}

export default HighlightedCountdown
