import Button from '@components/Button/Button'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { GettingStartedGuideStep, GettingStartedStepFragment } from 'types/GettingStartedGuide'
import { gettingStartedSteps } from '../data'
import GuideStepper from './comonents/GuideStepper'

import styles from './GettingStartedGuide.module.scss'

interface GettingStartedGuideProps {}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 800 : -800,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 800 : -800,
    opacity: 0,
  }),
}

const GettingStartedGuide: React.FC<GettingStartedGuideProps> = ({}) => {
  const { asPath, push } = useRouter()
  const [currentGuideStepFragment, setCurrentGuideStepFragment] =
    useState<GettingStartedStepFragment>()
  const [slideDirecton, setSlideDirecton] = useState(1)

  useEffect(() => {
    setCurrentGuideStepFragment(
      (asPath.split('#')[1] as GettingStartedStepFragment) || 'create-wallet'
    )
  }, [asPath])

  const currentGuideStep = useMemo(() => {
    return gettingStartedSteps.find((step) => step.fragment === currentGuideStepFragment)
  }, [currentGuideStepFragment])

  const handleClickStep = (step: GettingStartedGuideStep, isNavigationActive: boolean) => {
    setSlideDirecton(+step.id > +(currentGuideStep?.id || 0) ? 1 : -1)
    if (isNavigationActive) {
      push(`/getting-started/guide#${step.fragment}`)
    }
  }

  const isLastStep = useMemo(() => {
    if (currentGuideStep) {
      const lastStep = gettingStartedSteps[gettingStartedSteps.length - 1]
      return lastStep.fragment === currentGuideStep.fragment
    }
  }, [currentGuideStep])

  const nextStep = useMemo(() => {
    if (currentGuideStep) {
      const currentStepIdx = gettingStartedSteps.findIndex(
        (step) => step.fragment === currentGuideStep.fragment
      )
      return gettingStartedSteps[currentStepIdx + 1]
    }
  }, [currentGuideStep])

  const handleClickNextStep = () => {
    if (nextStep) {
      push(`/getting-started/guide#${nextStep.fragment}`)
    }
  }
  const handleClickLastStep = () => {
    push(`/my-assets`)
  }

  return currentGuideStepFragment ? (
    <div className={styles.container}>
      {currentGuideStep && (
        <GuideStepper
          onClickStep={handleClickStep}
          isNavigationActive
          activeStep={currentGuideStep}
        />
      )}

      <AnimatePresence initial={false} exitBeforeEnter custom={slideDirecton}>
        <motion.div
          key={currentGuideStepFragment}
          custom={slideDirecton}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className={styles.stepContainer}
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          {currentGuideStep?.component()}
        </motion.div>
      </AnimatePresence>

      <Button
        size="small"
        onClick={isLastStep ? handleClickLastStep : handleClickNextStep}
        className={styles.nextOrLastButtonContainer}
      >
        {isLastStep ? 'Join the fight' : 'Next step'}
      </Button>
    </div>
  ) : null
}

export default GettingStartedGuide
