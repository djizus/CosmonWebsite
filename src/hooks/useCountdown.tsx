import { msToTime } from '@utils/date'
import React, { useEffect, useMemo } from 'react'

type Timer = ReturnType<typeof setTimeout>

export const useCountdown = (
  timeToCount = 60 * 1000,
  interval = 1000
): [
  number,
  { days: string; hours: string; minutes: string; seconds: string },
  React.Dispatch<React.SetStateAction<number>>,
  () => void,
  boolean,
  () => void
] => {
  const [isPausing, setIsPausing] = React.useState<boolean>(false)
  const [timeLeft, setTimeLeft] = React.useState<number>(timeToCount)
  const timer = React.useRef<Timer>()

  const decreaseNum = () => setTimeLeft((prev) => prev - interval)

  useEffect(() => {
    timer.current = setTimeout(decreaseNum, interval)

    return () => clearTimeout(timer.current!)
  }, [])

  useEffect(() => {
    clearTimeout(timer.current!)
    if (timeLeft > 0) {
      timer.current = setTimeout(decreaseNum, interval)
    }
  }, [timeLeft])

  const pause = () => {
    setIsPausing(true)
    clearTimeout(timer.current!)
  }

  const resume = () => {
    setIsPausing(false)
    timer.current = setTimeout(decreaseNum, interval)
  }

  const timeLeftFormatted = useMemo(() => {
    return msToTime(timeLeft)
  }, [timeLeft])

  return [timeLeft, timeLeftFormatted, setTimeLeft, pause, isPausing, resume]
}
