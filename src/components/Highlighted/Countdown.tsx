import { useCountdown } from '@hooks/useCountdown'
import clsx from 'clsx'
import React from 'react'
import styles from './Countdown.module.scss'

interface CountdownProps {
  from: number // timestamp
}

const Countdown: React.FC<CountdownProps> = ({ from }) => {
  const [, timeLeft] = useCountdown(from)

  return (
    <div className={clsx(styles.countdownContainer)}>
      <div className="flex flex-col items-center justify-center">
        {from ? (
          <h3>
            {timeLeft.days}:{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
          </h3>
        ) : null}
        <p className="mt-[23px] text-sm">Just a few days to wait to fight for the prize pool</p>
      </div>
    </div>
  )
}

export default Countdown
