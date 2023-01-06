import Button from '@components/Button/Button'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import FlipCard from '@components/FlipCard/FlipCard'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CosmonType } from 'types'
import Confetti from 'react-confetti'
import * as style from './BuyCosmonModal.module.scss'
import { useWindowSize } from 'react-use'
import Hover from 'react-3d-hover'
import { getScarcityByCosmon, getTrait, getYieldPercent } from '@utils/cosmon'

interface Props {
  cosmon: CosmonType
  handleCloseModal: () => void
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

const BuyCosmonModal: React.FC<Props> = ({ cosmon, handleCloseModal }) => {
  const { width, height } = useWindowSize()
  const [isCardRevealed, setIsCardRevealed] = useState<boolean>(false)
  const router = useRouter()
  const [showConfetti, set_showConfetti] = useState<boolean>(false)
  const scarcity = getScarcityByCosmon(cosmon)
  useEffect(() => {
    if (isCardRevealed) {
      set_showConfetti(true)
    }
  }, [isCardRevealed])

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
          <p className={style.title}>New Cosmon</p>
          <div className={style.card}>
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
              revealed={isCardRevealed}
              className={clsx(style.flipCosmon, {
                [style.flipCosmonRevealed]: isCardRevealed,
              })}
              onClick={() => {
                if (!isCardRevealed) {
                  setIsCardRevealed(true)
                }
              }}
            />
            {isCardRevealed ? (
              <>
                <p className={style.cosmonName}>{cosmon.data.extension.name}</p>
                <p className={style.scarcity}>{scarcity}</p>
                <p className={style.yieldPercent}>{getYieldPercent(scarcity)}% Yield*</p>
                <p
                  className={style.description}
                  dangerouslySetInnerHTML={{
                    __html: getTrait(cosmon, 'Short Description') || '',
                  }}
                ></p>
              </>
            ) : (
              <p className={style.labelNotRevealed}>?</p>
            )}
          </div>
          {isCardRevealed ? (
            <>
              <Button className={style.button} onClick={() => router.push('/my-assets')}>
                See my assets
              </Button>
            </>
          ) : (
            <>
              <Button className={style.button} onClick={() => setIsCardRevealed(true)}>
                Reveal
              </Button>
            </>
          )}
          <p className={style.footerText}>
            *Returns shown represent past performances, and are not guarantees of future
            performances.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

BuyCosmonModal.displayName = 'BuyCosmonModal'

export default BuyCosmonModal
