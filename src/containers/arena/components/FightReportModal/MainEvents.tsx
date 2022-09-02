import { getCosmonStat } from '@utils/cosmon'
import React, { useMemo } from 'react'
import { FightType } from 'types'

interface MainEventsProps {
  battle: FightType
}

const MainEvents: React.FC<MainEventsProps> = ({ battle }) => {
  const iWin = useMemo(() => battle.winner.identity.includes(battle.me.identity), [battle])
  const iStart = useMemo(
    () => battle.me.cosmons.findIndex((c) => c.id === battle.events[0].atk_id) !== -1,
    []
  )

  return (
    <div className="flex flex-col items-center">
      <p className="text-white">
        {iWin
          ? 'You won, your Cosmons are making progresses!'
          : 'You lost, your Cosmons aren’t evolving…'}
      </p>
      {iWin ? (
        <div className="mt-[20px] flex w-full justify-center rounded-[20px] bg-[#282255] py-[20px]">
          <p className="font-normal">
            Victory by KO on round {battle.events[battle.events.length - 1].turn}
          </p>
        </div>
      ) : null}

      <div className="mt-[32px] mb-[100px] flex w-full flex-col justify-center rounded-[20px] bg-[#282255] py-[32px] px-[40px]">
        <div className="flex">
          <div className="flex flex-1 justify-center">
            <p className="text-white">{battle.me.deckName}</p>
          </div>
          <div className="flex flex-1 justify-center">
            <p className="text-white">{battle.opponent.deckName}</p>
          </div>
        </div>
        <div style={{ height: 0.5, width: '100%', background: '#9FA4DD', marginTop: 12 }} />

        <div className="mt-[20px] flex ">
          <div className="flex flex-1 flex-col items-start gap-[12px] pr-[20px]">
            {iStart ? (
              <p className="font-normal text-white">⚡️ &nbsp;&nbsp;First to attack</p>
            ) : null}
            {battle.me.cosmons
              .filter((c) => getCosmonStat(c.stats!, 'Hp')?.value === 0)
              .map((c) => (
                <p key={c.id} className="text-left font-normal text-white">
                  💥 &nbsp;&nbsp;{c.data.extension.name} is KO
                </p>
              ))}
          </div>
          <div
            className="flex flex-1 flex-col items-start gap-[12px] pl-[20px]"
            style={{ borderLeft: '0.5px solid #9FA4DD' }}
          >
            {!iStart ? (
              <p className="font-normal text-white">⚡️ &nbsp;&nbsp;First to attack</p>
            ) : null}
            {battle.opponent.cosmons
              .filter((c) => getCosmonStat(c.stats!, 'Hp')?.value === 0)
              .map((c) => (
                <p key={c.id} className="text-left font-normal text-white">
                  💥 &nbsp;&nbsp;{c.data.extension.name} is KO
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainEvents
