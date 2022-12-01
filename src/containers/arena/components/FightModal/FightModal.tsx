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
import Badge from '@components/Badge/Badge'
import { WINNER_IS_DRAW } from '@store/arenaStore'
import { CosmonTypeWithMalus } from 'types/Malus'
import { isMobile } from '@walletconnect/browser-utils'

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
  const { battle, battleOverTime, setBattleOverTime, skipTheFight } = useContext(FightContext)
  const mountedRef = useRef(false)
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
  const [malusAffinityHover, setMalusAffinityHover] = useState<boolean>(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

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

  const isDraw = useMemo(
    () => battleOverTime?.winner.identity?.toLowerCase() === WINNER_IS_DRAW.toLowerCase(),
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
    setSentence(
      <Trans>
        {iWin ? 'You won 💪' : isDraw ? 'It’s a draw. Both parties fought well!' : 'You lost 😟'}
      </Trans>
    )
    if (iWin && !isDraw) {
      setShowConfetti(true)
    }
    setIsFightEnd(true)
    onFightEnd()
  }, [fightSpeed, iWin, isDraw, onFightEnd])

  const playBattle = useCallback(async () => {
    const { opponent, me, events } = battleOverTime!

    // cancel events if cmp is dismount (e.g. on mobile, user close fight modal)
    if (!mountedRef.current) return

    // sleep
    await sleep(CARDS_REVEAL_START_AFTER / fightSpeed)

    // as the method continues to exec if the cmp is dismount, we have to check after each call to cancel next action
    if (!mountedRef.current) return

    // cards revelation
    await Promise.all([
      initCardsRevelation(opponent.cosmons, setRevealOpponentCards, CARD_REVEAL_INTERVAL),
      initCardsRevelation(me.cosmons, setRevealMyCards, CARD_REVEAL_INTERVAL),
    ])

    if (!mountedRef.current) return

    // who start
    await announceWhoStart()

    if (!mountedRef.current) return

    // shine starting cards
    await highlightStartingDeck()

    if (!mountedRef.current) return

    // sleep
    await sleep(1700 / fightSpeed)

    if (!mountedRef.current) return

    // fight start
    setIsFightEnd(false)

    if (!mountedRef.current) return

    // play every events
    for (const event of events) {
      if (!mountedRef.current) return
      const sent = await playEventAndGetCorrespondingSentence(event)
      setSentence(sent)

      // sleep
      await sleep(FIGHT_EVENT_DURATION / fightSpeed)
    }

    if (!mountedRef.current) return

    // sleep
    await sleep(1000 / fightSpeed)

    if (!mountedRef.current) return

    // winner
    await announceWinner()
  }, [battleOverTime, fightSpeed, mountedRef.current])

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
        { key: 'Hp', value: newHp.toString() },
      ],
    }
    return [...fightersTeam]
  }

  const handleHoverAffinity = useCallback((affinityData: Set<NFTId>, affinity: AFFINITY_TYPES) => {
    const affinityDatas = Array.from(affinityData)
    if (affinity === AFFINITY_TYPES.MALUS) {
      setMalusAffinityHover(true)
      setHighlightNftsWithAffinity(affinityDatas)
    } else {
      setHighlightNftsWithAffinity(affinityDatas)
    }
  }, [])

  const handleHoverStopAffinity = useCallback(() => {
    setMalusAffinityHover(false)
    setHighlightNftsWithAffinity(undefined)
  }, [])

  const computeIsDeckSlotHighlighted = useCallback(
    (cosmon: CosmonTypeWithMalus) => {
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
    <Modal fullScreen hasCloseButton={isMobile()} onCloseModal={onCloseModal}>
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
        <header className="flex justify-center py-[20px] lg:py-[30px]">
          <p className="text-xl font-normal text-white lg:text-3xl">
            <Trans
              i18nKey={`${battleOverTime && camelCase(battleOverTime.arena.name)}.name` || ''}
              t={t}
            />
          </p>
        </header>

        <main className="relative flex grow flex-col items-center">
          <div className="absolute left-0 hidden lg:flex" style={{ top: '51%' }}>
            {battle ? (
              <FightDeckAffinities
                cosmons={battle?.me.cosmons!}
                side="me"
                onHoverAffinity={handleHoverAffinity}
                onHoverStopAffinity={handleHoverStopAffinity}
              />
            ) : null}
          </div>
          <div className="absolute right-0 top-0 hidden lg:flex">
            {battle ? (
              <FightDeckAffinities
                cosmons={battle?.opponent.cosmons!}
                side="opponent"
                onHoverAffinity={handleHoverAffinity}
                onHoverStopAffinity={handleHoverStopAffinity}
              />
            ) : null}
          </div>

          <section className="flex items-center">
            <p className="text-md text-white lg:text-3xl ">
              {battleOverTime?.opponent.deckName ?? ''}
              {process.env.NEXT_PUBLIC_IS_PRODUCTION && battleOverTime?.opponent.isBot ? (
                <>
                  {' '}
                  <span
                    style={{
                      fontWeight: '300',
                      fontStyle: 'italic',
                    }}
                  >
                    (bot)
                  </span>
                </>
              ) : null}
            </p>
            <Badge className="ml-[20px] flex items-center justify-center">
              <p className="text-sm font-semibold text-white">
                Score {battleOverTime?.opponent.deckScore ?? ''}
              </p>
            </Badge>
          </section>

          <section
            className="mb-[15px] flex h-[90%] w-full max-w-[85%] grow justify-center pb-[10%] lg:h-full lg:max-w-[30%] lg:pb-[0]"
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
                  malusAffinityHover={malusAffinityHover}
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
                  malusAffinityHover={malusAffinityHover}
                />
              ))}
            </div>
          </section>

          <section className="flex items-center">
            <p className="text-md text-white lg:text-3xl">{battleOverTime?.me.deckName ?? ''}</p>
            <Badge className="ml-[20px] flex items-center justify-center">
              <p className="text-sm font-semibold text-white">
                Score {battleOverTime?.me.deckScore ?? ''}
              </p>
            </Badge>
          </section>
        </main>

        <footer className="relative mt-[30px] flex w-full  flex-col items-center justify-center px-[20px] pb-[20px] lg:px-0 lg:pb-[50px]">
          <div className="relative flex w-full items-center justify-center rounded-[10px] bg-[white]/[.2] py-[20px] lg:w-1/2 lg:flex-row">
            <p className="text-base font-normal text-white">
              {sentence || 'Fighters are getting ready...'}
            </p>
          </div>
          <div
            className="mt-[8%] flex items-center gap-[16px] lg:absolute lg:mt-0"
            style={{ right: 'calc(10%)' }}
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
        </footer>
      </div>
    </Modal>
  )
}

export default FightModal
