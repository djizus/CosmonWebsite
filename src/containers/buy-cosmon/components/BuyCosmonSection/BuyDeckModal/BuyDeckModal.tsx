import Button from '@components/Button/Button'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { CosmonType } from 'types'
import * as style from './BuyDeckModal.module.scss'
import Hover from 'react-3d-hover'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import FlipCard from '@components/FlipCard/FlipCard'
import { getScarcityByCosmon } from '@utils/cosmon'

interface Props {
  cosmons: CosmonType[]
  handleCloseModal: () => void
}

type CosmonRevealed = CosmonType & {
  isCardRevealed: boolean
}

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const BuyDeckModal: React.FC<Props> = ({ cosmons, handleCloseModal }) => {
  const [deck, setDeck] = useState<CosmonRevealed[]>(
    cosmons.map((cosmon) => ({
      ...cosmon,
      isCardRevealed: false,
    }))
  )
  const router = useRouter()
  const [showConfetti, set_showConfetti] = useState<boolean>(false)
  const { width, height } = useWindowSize()
  const isDeckRevealed = useMemo(() => {
    return deck.every((cosmon) => cosmon.isCardRevealed)
  }, [deck])

  useEffect(() => {
    if (isDeckRevealed) {
      set_showConfetti(true)
    }
  }, [isDeckRevealed])

  return (
    <motion.div
      onClick={(e) => {
        handleCloseModal()
        e.stopPropagation()
      }}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={style.overlay}
    >
      <div onClick={(e) => e.stopPropagation()} className={clsx(style.modal)}>
        {showConfetti && (
          <div className={style.confetti}>
            <Confetti
              numberOfPieces={1450}
              tweenDuration={16000}
              recycle={false}
              width={width}
              height={height}
            />
          </div>
        )}
        <Button
          withoutContainer
          className={style.closeButton}
          onClick={handleCloseModal}
          type="ghost"
        >
          ╳
        </Button>
        <div className={clsx(style.modalContent)}>
          <p className={style.title}>New Cosmons</p>
          <div className={style.card}>
            {deck.map((cosmon, index) => {
              return (
                <div className={style.cosmonColumn} key={cosmon.id}>
                  <FlipCard
                    card={
                      <CosmonCard
                        className={style.revealedCosmon}
                        cosmon={cosmon}
                        size={width < 640 ? 'sm' : 'md'}
                        showLevel
                        showPersonality
                        showNationality
                        showScarcity
                        imgStyle={{ objectFit: 'cover', borderRadius: 6 }}
                      />
                    }
                    cardBack={
                      <Hover scale={1.05} perspective={300} speed={10}>
                        <img
                          className={style.backCosmonImg}
                          src="/cosmons/bg-card/cards-recto.png"
                          alt="card background"
                        />
                      </Hover>
                    }
                    revealed={cosmon.isCardRevealed}
                    className={clsx(style.flipCosmon, {
                      [style.flipCosmonRevealed]: cosmon.isCardRevealed,
                    })}
                    onClick={() => {
                      if (!cosmon.isCardRevealed) {
                        const updatedDeck = [...deck]
                        updatedDeck[index] = { ...cosmon, isCardRevealed: true }
                        setDeck(updatedDeck)
                      }
                    }}
                  />
                  {cosmon.isCardRevealed ? (
                    <>
                      <p className={style.cosmonName}>{cosmon.data.extension.name}</p>
                      <p className={style.scarcity}>{getScarcityByCosmon(cosmon)}</p>
                    </>
                  ) : (
                    <p className={style.labelNotRevealed}>?</p>
                  )}
                </div>
              )
            })}
          </div>
          {isDeckRevealed ? (
            <>
              <Button className={style.button} onClick={() => router.push('/my-assets')}>
                See my assets
              </Button>
            </>
          ) : (
            <>
              <Button
                className={style.button}
                onClick={() => {
                  const updatedDeck = [...deck].map((cosmon) => {
                    return { ...cosmon, isCardRevealed: true }
                  })

                  setDeck(updatedDeck)
                }}
              >
                Reveal
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

BuyDeckModal.displayName = 'BuyDeckModal'

export default BuyDeckModal
