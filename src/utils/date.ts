export const msToTime = (durationInMs: number) => {
  const s = Math.floor((durationInMs / 1000) % 60)
  const m = Math.floor((durationInMs / (1000 * 60)) % 60)
  const h = Math.floor((durationInMs / (1000 * 60 * 60)) % 24)
  const d = Math.floor(durationInMs / (24 * 60 * 60 * 1000))

  const days = (d < 10 ? '0' + d : d).toString()
  const hours = (h < 10 ? '0' + h : h).toString()
  const minutes = (m < 10 ? '0' + m : m).toString()
  const seconds = (s < 10 ? '0' + s : s).toString()

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}
