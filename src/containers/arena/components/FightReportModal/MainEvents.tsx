import { useArenaStore, WINNER_IS_DRAW } from '@store/arenaStore'
import { useWalletStore } from '@store/walletStore'
import { convertNumberToNumberWithSuffix } from '@utils/conversion'
import { getCosmonStat } from '@utils/cosmon'
import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import { FightType } from 'types'
import FightLogsModal from './FightLogsModal'

interface MainEventsProps {
  battle: FightType
}

const MainEvents: React.FC<MainEventsProps> = ({ battle }) => {
  const [showFightLogsModal, setShowFightLogsModal] = useState(false)
  const { walletInfos, fetchWalletInfos } = useArenaStore()

  const { address } = useWalletStore()

  useEffect(() => {
    try {
      fetchWalletInfos(battle.arena.contract, address)
    } catch (error) {}
  }, [battle.arena.contract])

  const iWin = useMemo(() => battle.winner.identity.includes(battle.me.identity), [battle])
  const isDraw = useMemo(
    () => battle?.winner.identity?.toLowerCase() === WINNER_IS_DRAW.toLowerCase(),
    [battle]
  )
  const iStart = useMemo(
    () => battle.me.cosmons.findIndex((c) => c.id === battle.events[0].atk_id) !== -1,
    []
  )

  const handleClickOpenLogs = () => {
    setShowFightLogsModal(true)
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-white">
        {iWin
          ? 'You won, your Cosmons are making progresses!'
          : isDraw
          ? 'It’s a draw. Both parties fought well!'
          : 'You lost, your Cosmons aren’t evolving…'}
      </p>
      {iWin || isDraw ? (
        <div className="mt-[20px] flex w-full justify-center rounded-[20px] bg-[#282255] py-[20px]">
          <p className="font-normal">
            {iWin ? `Victory by KO on round` : `Draw without KO on round`}{' '}
            {battle.events[battle.events.length - 1].turn}
          </p>
        </div>
      ) : null}

      <div className="mt-[32px] flex w-full flex-col justify-center rounded-[20px] bg-[#282255] py-[32px] px-[40px]">
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

      {battle.arena.name !== 'Training' && (
        <div className="mt-[32px] flex w-full flex-col items-center justify-center rounded-[20px] bg-[#282255] py-[20px] px-[50px]">
          {iWin || isDraw ? (
            <p className="text-[14px] font-normal text-white">
              You just won {iWin ? 2 : 0} points
              {walletInfos.position !== null &&
                `, your rank is now 
              ${convertNumberToNumberWithSuffix(walletInfos.position)}`}
            </p>
          ) : (
            <p className="text-[14px] font-normal text-white">
              You just lost 1 point
              {walletInfos.position !== null &&
                `, your rank is now 
              ${convertNumberToNumberWithSuffix(walletInfos.position)}`}
            </p>
          )}
        </div>
      )}

      <div className="mt-[20px] mb-[27px] flex w-full flex-col items-center justify-center rounded-[20px] bg-[#282255] py-[20px] px-[50px]">
        <p className="text-[14px] font-normal">
          Learn more about the key moments by checking the fight logs!
        </p>
        <p
          onClick={handleClickOpenLogs}
          className="mt-[16px] cursor-pointer text-[14px] font-normal text-white underline"
        >
          Open logs
        </p>
      </div>

      <AnimatePresence>
        {showFightLogsModal ? (
          <FightLogsModal
            onCloseModal={() => {
              setShowFightLogsModal(false)
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default MainEvents
