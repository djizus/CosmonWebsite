import Button from '@components/Button/Button'
import { gettingStartedSteps } from '@containers/getting-started/data'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import { GettingStartedGuideStep } from 'types/GettingStartedGuide'

import styles from './GuideStepper.module.scss'

interface GuideStepperProps {
  activeStep: GettingStartedGuideStep
  isNavigationActive: boolean
  onClickStep: (step: GettingStartedGuideStep, isNavigationActive: boolean) => void
}

const GuideStepper: React.FC<GuideStepperProps> = ({
  activeStep,
  isNavigationActive,
  onClickStep,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.linkSegment} />
      {gettingStartedSteps.map((step, i) => (
        <div
          key={`${step.fragment}-${i}`}
          className={clsx(styles.stepContainer, {
            [styles.isActive]: activeStep.fragment === step.fragment,
            [styles.isNavigationActive]: isNavigationActive,
          })}
        >
          <div
            onClick={() => {
              onClickStep(step, isNavigationActive)
            }}
            className={styles.stepIndexContainer}
          >
            <span>{i + 1}</span>
          </div>

          <div className={styles.stepTitleContainer}>
            <span className={styles.stepTitle}>{step.title}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GuideStepper
