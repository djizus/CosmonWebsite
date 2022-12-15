import React, { useMemo } from 'react'
import { discoveryModes } from './data'

import styles from './GettingStarted.module.scss'

interface GettingStartedProps {}

const GettingStarted: React.FC<GettingStartedProps> = ({}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Start your journey with Cosmon</h1>

      <h3 className={styles.subtitle}>
        On the eve of the greatest battle in history, build your deck with the best conquerors and
        leaders of all time. Different personalities and strengths with one common goal: to win that
        war.
      </h3>

      <div className={styles.discoveryModesContainer}>
        <DiscoveryMode mode="noob" />
        <DiscoveryMode mode="expert" />
      </div>
    </div>
  )
}

GettingStarted.displayName = 'GettingStarted'
export default GettingStarted

interface DiscoveryModeProps {
  mode: 'noob' | 'expert'
}

const DiscoveryMode: React.FC<DiscoveryModeProps> = ({ mode }) => {
  const discoverModeData = useMemo(() => {
    return discoveryModes[mode]
  }, [mode])
  return (
    <div className={styles.discoveryModeContainer}>
      {discoverModeData.card()}
      <div className={styles.discoveryModeTitleContainer}>
        <span>{discoverModeData.title}</span>
      </div>
      {discoverModeData.button()}
    </div>
  )
}

DiscoveryMode.displayName = 'DiscoveryMode'
