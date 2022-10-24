import Countdown from '@components/Countdown/Countdown'
import Slider from '@components/Slider/Slider'
import Tooltip from '@components/Tooltip/Tooltip'
import { getMEAs } from '@containers/arena/data'
import { useArenaStore } from '@store/arenaStore'
import { useGameStore } from '@store/gameStore'
import { convertMicroDenomToDenom } from '@utils/conversion'
import { sleep } from '@utils/sleep'
import clsx from 'clsx'
import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import MEA from '../MEA/MEA'
import PrizePoolBreakdown from './PrizePoolBreakdown'
import * as style from './style.module.scss'

interface HeroProps {}

const Hero: React.FC<HeroProps> = ({}) => {
  const {
    fetchCurrentChampionshipNumber,
    currentChampionshipNumber,
    getNextLeagueOpenTime,
    getPrizePool,
    prizePool,
  } = useArenaStore()
  const { arenasList, fetchArenasList } = useGameStore()
  const [time, setTime] = useState<Date | undefined>(getNextLeagueOpenTime())
  const { width } = useWindowSize()

  useEffect(() => {
    if (arenasList?.length > 0) {
      // @TODO: we will need to update this part for the second league
      const leaguePro = arenasList.filter((a) => a.name !== 'Training')[0]
      if (leaguePro) {
        getPrizePool(leaguePro.contract)
        fetchCurrentChampionshipNumber(leaguePro.contract)
      }
    }
  }, [arenasList])

  const refreshTime = async () => {
    setTime(undefined)
    await sleep(1000)
    fetchArenasList()
    setTime(getNextLeagueOpenTime())
  }

  return (
    <div className="relative h-[320px] lg:h-[380px] lg:bg-cosmon-main-quaternary">
      {/* DESKTOP */}
      <div className="hidden h-full items-center justify-center gap-x-[54px] lg:flex">
        {getMEAs().map((mea, i) => (
          <MEA key={`mea-${i}`} {...mea} />
        ))}
        <div
          style={{
            position: 'relative',
            background: 'url(/mea-bg-outline.png) top left no-repeat',
            backgroundSize: 'cover',
            height: 235,
            width: 600,
            borderRadius: 16,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 1,
              left: 1,
              right: 1,
              bottom: 1,
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              background: 'url(/mea-bg.png) top left no-repeat',
              backgroundSize: 'contain',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: 52,
              paddingTop: 52,
            }}
          >
            <div className="flex self-start">
              <h2 className="text-[34px] leading-[26px]">
                Championship #{currentChampionshipNumber}
              </h2>
            </div>
            <div className="flex items-center ">
              <div className="mt-[40px] flex flex-col items-center pl-4">
                <div className="flex items-center gap-[10px]">
                  <img src="/xki-logo.png" style={{ width: 30, height: 30 }} />
                  <p className="text-[34px] font-extrabold italic leading-[26px] text-white">
                    {prizePool
                      ? `${numeral(convertMicroDenomToDenom(prizePool?.amount!)).format('0,0')}`
                      : 'XXXX'}
                  </p>
                </div>
                <div className={style.tipContainer}>
                  <p
                    className={clsx(
                      'text-[20px] font-semibold text-[#9FA4DD]',
                      style.prizePoolText
                    )}
                  >
                    Prize pool
                  </p>
                  <img
                    src="/icons/info.svg"
                    alt="Prizepool info"
                    data-tip="Prizepool"
                    data-for={`prizepool`}
                    className="h-[24px] w-[24px] cursor-help"
                  />
                  <Tooltip
                    className={style.toolTip}
                    id={`prizepool`}
                    place="bottom"
                    offset={{
                      bottom: 8,
                    }}
                  >
                    <PrizePoolBreakdown />
                  </Tooltip>
                </div>
              </div>
              <div className="mt-[40px] flex flex-1 flex-col items-center justify-center">
                {time ? (
                  <Countdown
                    from={new Date()}
                    to={time}
                    onCountdownReached={refreshTime}
                    className="text-[34px] font-extrabold italic leading-[30px] text-white"
                  />
                ) : (
                  <p className="text-[34px] font-extrabold italic leading-[30px] text-white">00</p>
                )}
                <p className="mt-[16px] text-[20px] font-semibold text-[#9FA4DD]">
                  Championship ends in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE */}
      <div className="relative flex h-full items-center justify-center px-[10px] pb-[0px] lg:hidden">
        <Slider showNavigationButtons={false} containerClassName="w-full h-full flex items-center ">
          <div
            style={{
              position: 'relative',
              background: 'url(/mea-bg-outline.png) 10% 50% no-repeat',
              backgroundSize: 'cover',
              width: '100%',
              height: '100%',
              aspectRatio: '1',
              borderRadius: 16,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 1,
                left: 1,
                right: 1,
                bottom: 1,
                width: 'calc(100% - 2px)',
                height: 'calc(100% - 2px)',
                background: 'url(/mea-bg.png) 48% 55% no-repeat',
                backgroundSize: 'cover',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="flex">
                <h2 className="text-[24px] leading-[25px]">
                  Championship #{currentChampionshipNumber}
                </h2>
              </div>
              <div className="flex flex-col items-center">
                <div className="mt-[40px] flex flex-col items-center pl-4">
                  <div className="flex items-center gap-[10px]">
                    <img src="/xki-logo.png" style={{ width: 30, height: 30 }} />
                    <p className="text-[34px] font-extrabold italic leading-[26px] text-white">
                      {prizePool
                        ? `${numeral(convertMicroDenomToDenom(prizePool?.amount!)).format('0,0')}`
                        : 'XXXX'}
                    </p>
                  </div>
                  <div className={style.tipContainer}>
                    <p
                      className={clsx(
                        'text-[20px] font-semibold text-[#9FA4DD]',
                        style.prizePoolText
                      )}
                    >
                      Prize pool
                    </p>
                    <img
                      src="/icons/info.svg"
                      alt="Prizepool info"
                      data-tip="Prizepool"
                      data-for={`prizepool`}
                      className="h-[24px] w-[24px] cursor-help"
                    />
                    <Tooltip
                      className={style.toolTip}
                      id={`prizepool`}
                      place="bottom"
                      offset={{
                        bottom: 8,
                        left: width < 640 ? 60 : 0,
                      }}
                    >
                      <PrizePoolBreakdown />
                    </Tooltip>
                  </div>
                </div>
                <div className="mt-[40px] flex flex-1 flex-col items-center justify-center">
                  {time ? (
                    <Countdown
                      from={new Date()}
                      to={time}
                      onCountdownReached={refreshTime}
                      className="text-[34px] font-extrabold italic leading-[30px] text-white"
                    />
                  ) : (
                    <p className="text-[34px] font-extrabold italic leading-[30px] text-white">
                      00
                    </p>
                  )}
                  <p className="mt-[16px] text-[20px] font-semibold text-[#9FA4DD]">
                    Championship ends in
                  </p>
                </div>
              </div>
            </div>
          </div>
          {getMEAs().map((mea, i) => (
            <MEA key={`mea-${i}`} {...mea} />
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default Hero
