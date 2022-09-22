import { useCountdown } from '@hooks/useCountdown'
import { differenceInMilliseconds } from 'date-fns'
import React from 'react'

interface CountdownProps {
  from: Date
  to: Date
  className?: string
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span'
}

const Countdown: React.FC<CountdownProps> = ({ from, to, className, tag: Tag = 'p' }) => {
  const [, timeLeft] = useCountdown(differenceInMilliseconds(to, from))
  return (
    <Tag className={className}>
      {timeLeft.days}&nbsp;:&nbsp;{timeLeft.hours}&nbsp;:&nbsp;{timeLeft.minutes}&nbsp;:&nbsp;
      {timeLeft.seconds}
    </Tag>
  )
}

export default Countdown
