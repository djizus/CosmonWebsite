import Modal from '@components/Modal/Modal'
import { useTranslation } from '@services/translations'
import camelCase from 'lodash/camelCase'
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Trans } from 'react-i18next'
import { useWindowSize } from 'react-use'
import { AFFINITY_TYPES, CosmonType, FightEventType, FightType, NFTId } from 'types'
import Confetti from 'react-confetti'
import Fighter from './Fighter'
import { FightContext } from '../FightContext'
import { sleep } from '@utils/sleep'
import ButtonForward from '@components/Button/ButtonForward'
import ButtonPlay from '@components/Button/ButtonPlay'
import FightDeckAffinities from './FightDeckAffinities'

interface FightModalProps {
  onCloseModal: () => void
  onFightEnd: () => void
}

const FIGHT_EVENT_DURATION = 1500
const CARD_REVEAL_INTERVAL = 1000
const CARDS_REVEAL_START_AFTER = 2000
const FIGHT_PLAY_SPEED = 1
const FIGHT_FORWARD_SPEED = 1.5

const FightModal: React.FC<FightModalProps> = ({ onCloseModal, onFightEnd }) => {
  const { t } = useTranslation(['arenas', 'arena', 'fight'])
  const { battle, battleOverTime, setBattleOverTime } = useContext(FightContext)

  const fighters = useRef<CosmonType[]>()

  const { width, height } = useWindowSize()
  const [revealOpponentCards, setRevealOpponentCards] = useState<string[]>([])
  const [revealMyCards, setRevealMyCards] = useState<string[]>([])
  const [sentence, setSentence] = useState<ReactNode | undefined>()
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [shineStartingDeck, setShineStartingDeck] = useState<boolean>(false)
  const [isDodge, setIsDodge] = useState<boolean>(false)
  const [critical, setCritical] = useState<number | undefined>()
  const [isFightEnd, setIsFightEnd] = useState<boolean>()
  const [currentAttacker, setCurrentAttacker] = useState<CosmonType | undefined>()
  const [currentDefender, setCurrentDefender] = useState<CosmonType | undefined>()
  const [currentFightEvent, setCurrentFightEvent] = useState<FightEventType>()
  const [fightSpeed, setFightSpeed] = useState(FIGHT_PLAY_SPEED)
  const [highlightNftsWithAffinity, setHighlightNftsWithAffinity] = useState<string[] | undefined>()

  useEffect(() => {
    if (battle) {
      fighters.current = [...battle.opponent.cosmons, ...battle.me.cosmons]
      if (fighters.current.length > 0) {
        playBattle()
      }
    }
  }, [battle])

  const iWin = useMemo(
    () => battleOverTime?.winner.identity.includes(battleOverTime!.me.identity) || false,
    [battleOverTime]
  )

  const iStart = useMemo(
    () =>
      battleOverTime?.me.cosmons.findIndex((c) => c.id === battleOverTime!.events[0].atk_id) !==
        -1 || false,
    [battleOverTime]
  )

  const initCardsRevelation = useCallback(
    async (
      cosmonsList: CosmonType[],
      set: React.Dispatch<React.SetStateAction<string[]>>,
      intervalInMs: number
    ) => {
      for (let index = 0; index < cosmonsList.length; index++) {
        const cosmon = cosmonsList[index]
        set((prevState) => [...prevState, cosmon.id])
        await sleep(intervalInMs / fightSpeed)
      }
    },
    [fightSpeed]
  )

  const announceWhoStart = useCallback(async () => {
    await sleep(1000 / fightSpeed)
    setSentence(
      `The fight is starting. ${iStart ? 'Your team' : 'The opponent'} deck is engaging the battle.`
    )
  }, [fightSpeed, iStart])

  const highlightStartingDeck = useCallback(async () => {
    setShineStartingDeck(true)
    await sleep(1000 / fightSpeed)
    setShineStartingDeck(false)
  }, [fightSpeed])

  const announceWinner = useCallback(async () => {
    setSentence(<Trans>{iWin ? 'You won 💪' : 'You lost 😟'}</Trans>)
    if (iWin) {
      setShowConfetti(true)
    }
    setIsFightEnd(true)
    onFightEnd()
  }, [fightSpeed, iWin])

  const playBattle = useCallback(async () => {
    const { opponent, me, events } = battleOverTime!

    // sleep
    await sleep(CARDS_REVEAL_START_AFTER / fightSpeed)

    // cards revelation
    await Promise.all([
      initCardsRevelation(opponent.cosmons, setRevealOpponentCards, CARD_REVEAL_INTERVAL),
      initCardsRevelation(me.cosmons, setRevealMyCards, CARD_REVEAL_INTERVAL),
    ])

    // who start
    await announceWhoStart()

    // shine starting cards
    await highlightStartingDeck()

    // sleep
    await sleep(1700 / fightSpeed)

    // fight start
    setIsFightEnd(false)

    // play every events
    for (const event of events) {
      const sent = await playEventAndGetCorrespondingSentence(event)
      setSentence(sent)

      // sleep
      await sleep(FIGHT_EVENT_DURATION / fightSpeed)
    }

    // sleep
    await sleep(1000 / fightSpeed)

    // winner
    await announceWinner()
  }, [battleOverTime, fightSpeed, iWin])

  const playEventAndGetCorrespondingSentence = useCallback(
    async (event: FightEventType) => {
      const { atk_id, def_id, critical, def_health, miss, damage } = event
      setCurrentFightEvent({ ...event })
      const attacker = fighters.current?.find((f) => f.id === atk_id)
      setCurrentAttacker(attacker)
      const defender = fighters.current?.find((f) => f.id === def_id)
      setCurrentDefender(defender)
      const defenderIsInOpponentTeam =
        battleOverTime?.opponent.cosmons.findIndex((c) => c.id === def_id) !== -1
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
      setBattleOverTime(
        (prevState: FightType | undefined) =>
          ({
            ...prevState,
            [keyToUpdate]: {
              ...prevState![keyToUpdate],
              cosmons: updateFighters(def_health, def_id, battleOverTime![keyToUpdate].cosmons),
            },
          } as FightType)
      )

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
            left in {defenderIsInOpponentTeam ? 'the opponent team' : 'your team'}
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
    },
    [fightSpeed, battleOverTime]
  )

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

  const handleHoverAffinity = useCallback((affinityData: Set<NFTId>, affinity: AFFINITY_TYPES) => {
    const affinityDatas = Array.from(affinityData)
    setHighlightNftsWithAffinity(affinityDatas)
  }, [])

  const handleHoverStopAffinity = useCallback(() => {
    setHighlightNftsWithAffinity(undefined)
  }, [])

  const computeIsDeckSlotHighlighted = useCallback(
    (cosmon: CosmonType) => {
      if (!highlightNftsWithAffinity) return
      const hasChildrenArray = Array.isArray(highlightNftsWithAffinity[0])
      if (!hasChildrenArray) {
        return cosmon && highlightNftsWithAffinity.includes(cosmon.id)
      }
      return highlightNftsWithAffinity.some((arrayIds) => cosmon && arrayIds.includes(cosmon.id))
    },
    [highlightNftsWithAffinity]
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
              i18nKey={`${battleOverTime && camelCase(battleOverTime.arena.name)}.name` || ''}
              t={t}
            />
          </p>
        </header>

        <main className="relative flex grow flex-col items-center">
          <div className="absolute left-0" style={{ top: '51%' }}>
            {battle ? (
              <FightDeckAffinities
                cosmons={battle?.me.cosmons!}
                side="me"
                onHoverAffinity={handleHoverAffinity}
                onHoverStopAffinity={handleHoverStopAffinity}
              />
            ) : null}
          </div>
          <div className="absolute right-0 top-0">
            {battle ? (
              <FightDeckAffinities
                cosmons={battle?.opponent.cosmons!}
                side="opponent"
                onHoverAffinity={handleHoverAffinity}
                onHoverStopAffinity={handleHoverStopAffinity}
              />
            ) : null}
          </div>

          <section>
            <p className="text-3xl text-white">{battleOverTime?.opponent.deckName ?? ''}</p>
          </section>

          <section
            className=" mb-[15px] flex h-full w-full max-w-[30%] grow justify-center"
            style={{ transform: 'perspective(150vw) rotateX(20deg)', marginBottom: '1.5%' }}
          >
            <div className="grid h-full w-full grid-cols-3 gap-3 gap-y-6 rounded-md border-[0.5px] border-[#6d77db] p-3">
              {battleOverTime?.opponent.cosmons.map((opponentCosmon) => (
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
                  animationsSpeed={fightSpeed}
                  highlightSameAffinity={computeIsDeckSlotHighlighted(opponentCosmon)}
                />
              ))}

              {battleOverTime?.me.cosmons.map((meCosmon) => (
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
                  animationsSpeed={fightSpeed}
                  highlightSameAffinity={computeIsDeckSlotHighlighted(meCosmon)}
                />
              ))}
            </div>
          </section>

          <section>
            <p className="text-3xl text-white">{battleOverTime?.me.deckName ?? ''}</p>
          </section>
        </main>

        <footer className="relative mt-[30px] flex w-full items-center justify-center pb-[50px]">
          <div className="relative flex w-1/2 items-center justify-center rounded-[10px] bg-[white]/[.2] py-[20px]">
            <p className="text-base font-normal text-white">
              {sentence || 'Fighters are getting ready...'}
            </p>
            <div
              className="absolute ml-[40px] flex items-center gap-[16px]"
              style={{ left: 'calc(100%)' }}
            >
              <ButtonPlay
                isActive={fightSpeed === FIGHT_PLAY_SPEED}
                onClick={() => {
                  setFightSpeed(FIGHT_PLAY_SPEED)
                }}
              />
              <ButtonForward
                isActive={fightSpeed === FIGHT_FORWARD_SPEED}
                onClick={() => {
                  setFightSpeed(FIGHT_FORWARD_SPEED)
                }}
              />
            </div>
          </div>
        </footer>
      </div>
    </Modal>
  )
}

export default FightModal
