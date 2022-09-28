import { useCountdown } from '@hooks/useCountdown'
import { differenceInMilliseconds } from 'date-fns'
import React, { useEffect } from 'react'

interface CountdownProps {
  from: Date
  to: Date
  className?: string
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span'
  onCountdownReached?: () => void
}

const Countdown: React.FC<CountdownProps> = ({
  from,
  to,
  className,
  tag: Tag = 'p',
  onCountdownReached,
}) => {
  const [timeLeft, timeLeftFormatted] = useCountdown(differenceInMilliseconds(to, from))

  useEffect(() => {
    if (timeLeft === 0 && onCountdownReached) {
      onCountdownReached()
    }
  }, [timeLeft])

  return (
    <Tag className={className}>
      {+timeLeftFormatted.days > 0 ? timeLeftFormatted.days + '\xa0:\xa0' : ''}
      {+timeLeftFormatted.hours > 0 ? timeLeftFormatted.days + '\xa0:\xa0' : ''}
      {timeLeftFormatted.minutes}&nbsp;:&nbsp;
      {timeLeftFormatted.seconds}
    </Tag>
  )
}

export default Countdown
