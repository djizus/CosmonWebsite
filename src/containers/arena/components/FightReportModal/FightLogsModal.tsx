import Button from '@components/Button/Button'
import Modal from '@components/Modal/Modal'
import clsx from 'clsx'
import React, { useContext, useRef } from 'react'
import { Trans } from 'react-i18next'
import { FightEventType } from 'types'
import { FightContext } from '../FightContext'

interface FightLogsModalProps {
  onCloseModal: () => void
}

const FightLogsModal: React.FC<FightLogsModalProps> = ({ onCloseModal }) => {
  const { battle } = useContext(FightContext)

  const fighters = useRef([...battle?.opponent.cosmons!, ...battle?.me.cosmons!]).current
  const opponentFighters = useRef(battle?.opponent.cosmons!.map((c) => c.id))
  const myFighters = useRef(battle?.me.cosmons!.map((c) => c.id))

  const renderEventSentence = (event: FightEventType) => {
    const { atk_id, def_id, critical, def_health, miss, damage } = event
    const attacker = fighters?.find((f) => f.id === atk_id)
    const defender = fighters?.find((f) => f.id === def_id)
    const defenderIsInOpponentTeam =
      battle?.opponent.cosmons.findIndex((c) => c.id === def_id) !== -1

    if (miss) {
      return (
        <Trans>
          The fight is running hard! {{ defenderName: defender?.data.extension.name }} just dodged
          the opponent attack!
        </Trans>
      )
    }

    if (def_health === 0) {
      if (defenderIsInOpponentTeam) {
        opponentFighters.current = opponentFighters.current?.filter((id) => id !== def_id)
      } else {
        myFighters.current = myFighters.current?.filter((id) => id !== def_id)
      }
      return (
        <Trans>
          The fight is running hard! {{ defenderName: defender?.data.extension.name }} is KO... Only{' '}
          {{
            nbKeepingCards: defenderIsInOpponentTeam
              ? opponentFighters.current!.length
              : myFighters.current!.length,
          }}{' '}
          left in {defenderIsInOpponentTeam ? 'the opponent team' : 'your team'}
        </Trans>
      )
    }

    if (critical) {
      return (
        <Trans>
          The fight is running hard! {attacker?.data.extension.name} performed a critical attack!
        </Trans>
      )
    }

    return (
      <Trans>
        {{ attackerName: attacker?.data.extension.name }} inflicted {{ damage }} points of damage to{' '}
        {{ defenderName: defender?.data.extension.name }}
      </Trans>
    )
  }

  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton={false} width={700}>
      <p className="text-lg text-white">Fight log</p>

      <div
        className="mt-[20px] flex w-full flex-col gap-[8px] rounded-[20px] bg-[#282255] py-[20px] px-[40px]"
        style={{ maxHeight: '60vh', overflow: 'auto' }}
      >
        {battle?.events.map((event) => (
          <p
            className={clsx('text-left text-sm font-normal', {
              ['text-cosmon-main-tertiary']: event.def_health === 0 && event.miss === false,
            })}
          >
            {renderEventSentence(event)}
          </p>
        ))}
      </div>
      <div className="mt-[89px] flex justify-center">
        <Button size="small" type="secondary" onClick={onCloseModal}>
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default FightLogsModal
