import Modal from '@components/Modal/Modal'
import { useTranslation } from '@services/translations'
import camelCase from 'lodash/camelCase'
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
import { useMount, useWindowSize } from 'react-use'
import { CosmonType, FightEventType, FightType } from 'types'
import Confetti from 'react-confetti'
import Fighter from './Fighter'

interface FightModalProps {
  battle: FightType
  onCloseModal: () => void
  onFightEnd: (finalBattle?: FightType) => void
}

const FIGHT_EVENT_DURATION = 2000
const CARD_REVEAL_INTERVAL = 1000
// Fight animations chain
const CARDS_REVEAL_START_AFTER = 2000
const WHO_STARTS_START_AFTER = 7000
const FIGHT_START_AFTER = 9000

const FightModal: React.FC<FightModalProps> = ({ battle, onCloseModal, onFightEnd }) => {
  const { t } = useTranslation(['arenas', 'arena', 'fight'])
  const { width, height } = useWindowSize()
  const [revealOpponentCards, setRevealOpponentCards] = useState<string[]>([])
  const [revealMyCards, setRevealMyCards] = useState<string[]>([])
  const [sentence, setSentence] = useState<ReactNode | undefined>()
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [shineStartingDeck, setShineStartingDeck] = useState<boolean>(false)
  const [isDodge, setIsDodge] = useState<boolean>(false)
  const [critical, setCritical] = useState<number | undefined>()
  const [isFightEnd, setIsFightEnd] = useState<boolean>()
  const [internBattle, setInternBattle] = useState<FightType>()
  const [currentAttacker, setCurrentAttacker] = useState<CosmonType | undefined>()
  const [currentDefender, setCurrentDefender] = useState<CosmonType | undefined>()
  const [currentFightEvent, setCurrentFightEvent] = useState<FightEventType>()
  const [fighters, setFighters] = useState<CosmonType[]>()

  useEffect(() => {
    if (battle) {
      console.log('HALLO battle :: ', battle)
      setFighters([...battle!.me.cosmons, ...battle!.opponent.cosmons])
      setInternBattle(battle)
      playBattle(battle)
    }
  }, [battle])

  const iWin = useMemo(
    () =>
      (internBattle && internBattle!.winner.identity.includes(internBattle!.me.identity)) || false,
    [internBattle]
  )

  const iStart = useMemo(
    () =>
      (internBattle &&
        internBattle?.me.cosmons.findIndex((c) => c.id === internBattle.events[0].atk_id) !== -1) ||
      false,
    [internBattle]
  )

  const playBattle = (battle: FightType) => {
    // will last (3 * 1sec) * 2 decks = 6
    setTimeout(() => {
      initCardsRevelation(battle.opponent.cosmons, setRevealOpponentCards, CARD_REVEAL_INTERVAL)
      initCardsRevelation(battle.me.cosmons, setRevealMyCards, CARD_REVEAL_INTERVAL)
    }, CARDS_REVEAL_START_AFTER)
    // who start
    setTimeout(() => {
      setSentence(
        `The fight is starting. ${
          iStart ? 'Your team' : 'The opponent'
        } deck is engaging the battle.`
      )
    }, WHO_STARTS_START_AFTER)
    // shine starting cards
    setTimeout(() => {
      setShineStartingDeck(true)
      setTimeout(() => {
        setShineStartingDeck(false)
      }, 1000)
    }, WHO_STARTS_START_AFTER)
    // fight events
    setTimeout(() => {
      setIsFightEnd(false)
      for (let i = 0; i < battle.events.length; i++) {
        const sent = displayBattleEventSentence(battle.events[i])
        setTimeout(() => {
          setSentence(sent)
        }, (i + 1) * FIGHT_EVENT_DURATION)
      }
      setTimeout(() => {
        setSentence(<Trans>{iWin ? 'You won 💪' : 'You lost 🥹'}</Trans>)
        if (iWin) {
          setShowConfetti(true)
        }
        setIsFightEnd(true)
        onFightEnd(battle)
      }, battle.events.length * FIGHT_EVENT_DURATION + 3000)
    }, FIGHT_START_AFTER)
  }

  const updateFighters = (newHp: number, defenderId: string, fightersTeam: CosmonType[]) => {
    const defPos = fightersTeam.findIndex((c) => c.id === defenderId)
    fightersTeam[defPos] = {
      ...fightersTeam[defPos],
      stats: [
        ...fightersTeam[defPos]?.stats!.filter((k) => k.key !== 'Hp'),
        { key: 'Hp', value: newHp },
      ],
    }
    return [...fightersTeam]
  }

  const displayBattleEventSentence = (event: FightEventType) => {
    console.log('displayBattleEventSentence :: ', internBattle, fighters)
    const { atk_id, def_id, critical, def_health, miss, damage } = event
    setCurrentFightEvent({ ...event })
    const attacker = fighters?.find((f) => f.id === atk_id)
    setCurrentAttacker(attacker)
    const defender = fighters?.find((f) => f.id === def_id)
    setCurrentDefender(defender)
    const defenderIsInOpponentTeam =
      internBattle?.opponent.cosmons.findIndex((c) => c.id === def_id) !== -1
    setIsDodge(false)
    setCritical(undefined)

    if (miss) {
      setIsDodge(true)
      return (
        <Trans>
          The fight is running hard!{' '}
          <strong>{{ defenderName: defender?.data.extension.name }}</strong> just dodged the
          opponent attack!
        </Trans>
      )
    }

    if (critical) {
      setCritical(damage)
    }

    const keyToUpdate = defenderIsInOpponentTeam ? 'opponent' : 'me'
    if (internBattle) {
      setInternBattle((prevState) => ({
        ...prevState,
        [keyToUpdate]: {
          ...prevState[keyToUpdate],
          cosmons: updateFighters(def_health, def_id, internBattle[keyToUpdate].cosmons),
        },
      }))
    }

    if (def_health === 0) {
      if (defenderIsInOpponentTeam) {
        setRevealOpponentCards((prev) => prev.filter((id) => id !== def_id))
      } else {
        setRevealMyCards((prev) => prev.filter((id) => id !== def_id))
      }

      return (
        <Trans>
          The fight is running hard!{' '}
          <strong>{{ defenderName: defender?.data.extension.name }}</strong> is KO... Only{' '}
          {{
            nbKeepingCards: defenderIsInOpponentTeam
              ? revealOpponentCards.length
              : revealMyCards.length,
          }}{' '}
          in {defenderIsInOpponentTeam ? 'the opponent team' : 'your team'}
        </Trans>
      )
    }

    if (critical) {
      return (
        <Trans>
          The fight is running hard! <strong>{attacker?.data.extension.name}</strong> performed a
          critical attack!
        </Trans>
      )
    }

    return (
      <Trans>
        <strong>{{ attackerName: attacker?.data.extension.name }}</strong> inflicted{' '}
        <strong>{{ damage }}</strong> points of damage to{' '}
        <strong>{{ defenderName: defender?.data.extension.name }}</strong>
      </Trans>
    )
  }

  const initCardsRevelation = useCallback(
    (
      cosmonsList: CosmonType[],
      set: React.Dispatch<React.SetStateAction<string[]>>,
      intervalInMs: number
    ) => {
      for (let index = 0; index < cosmonsList.length; index++) {
        const cosmon = cosmonsList[index]
        setTimeout(() => {
          set((prevState) => [...prevState, cosmon.id])
        }, (index + 1) * intervalInMs)
      }
    },
    []
  )

  return (
    <Modal fullScreen hasCloseButton={false} onCloseModal={onCloseModal}>
      {showConfetti && (
        <div className="fixed z-[500]">
          <Confetti
            numberOfPieces={1450}
            tweenDuration={16000}
            recycle={false}
            width={width}
            height={height}
          />
        </div>
      )}
      <div
        className="flex h-screen flex-1 flex-col"
        style={{
          backgroundImage: 'url("/bg-deck-builder.png")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      >
        <header className="flex justify-center py-[30px]">
          <p className="text-3xl font-normal text-white">
            <Trans
              i18nKey={`${internBattle && camelCase(internBattle.arena.name)}.name` || ''}
              t={t}
            />
          </p>
        </header>

        <main className="flex grow flex-col items-center">
          <section>
            <p className="text-3xl text-white">{internBattle?.opponent.deckName ?? ''}</p>
          </section>

          <section
            className=" mb-[15px] flex h-full w-full max-w-[30%] grow justify-center"
            style={{ transform: 'perspective(150vw) rotateX(20deg)', marginBottom: '1.5%' }}
          >
            <div className="grid h-full w-full grid-cols-3 gap-3 gap-y-6 rounded-md border-[0.5px] border-[#6d77db] p-3">
              {internBattle?.opponent.cosmons.map((opponentCosmon) => (
                <Fighter
                  key={opponentCosmon.id}
                  cosmon={opponentCosmon}
                  isAttacker={isFightEnd === false && opponentCosmon.id === currentAttacker?.id}
                  isDefender={isFightEnd === false && opponentCosmon.id === currentDefender?.id}
                  isKO={
                    isFightEnd === false &&
                    revealOpponentCards.findIndex((id) => id === opponentCosmon.id) === -1
                  }
                  isOpponentSide
                  isDodge={isDodge}
                  isFightStart={isFightEnd === false}
                  critical={critical}
                  shine={shineStartingDeck && !iStart}
                  revealCards={revealOpponentCards}
                  currentFightEvent={currentFightEvent}
                />
              ))}
              {internBattle?.me.cosmons.map((meCosmon) => (
                <Fighter
                  key={meCosmon.id}
                  cosmon={meCosmon}
                  isAttacker={isFightEnd === false && meCosmon.id === currentAttacker?.id}
                  isDefender={isFightEnd === false && meCosmon.id === currentDefender?.id}
                  isKO={
                    isFightEnd === false &&
                    revealMyCards.findIndex((id) => id === meCosmon.id) === -1
                  }
                  isDodge={isDodge}
                  isOpponentSide={false}
                  isFightStart={isFightEnd === false}
                  critical={critical}
                  shine={shineStartingDeck && iStart}
                  revealCards={revealMyCards}
                  currentFightEvent={currentFightEvent}
                />
              ))}
            </div>
          </section>

          <section>
            <p className="text-3xl text-white">{internBattle?.me.deckName ?? ''}</p>
          </section>
        </main>

        <footer className="mt-[30px] flex w-full justify-center pb-[50px]">
          <div className="flex w-1/2 items-center justify-center rounded-[10px] bg-[white]/[.2] py-[20px]">
            <p className="text-base font-normal text-white">
              {sentence || 'Fighters are getting ready...'}
            </p>
          </div>
        </footer>
      </div>
    </Modal>
  )
}

export default FightModal
