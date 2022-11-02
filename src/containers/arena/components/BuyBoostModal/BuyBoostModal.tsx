import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import BoostPicker from './BoostPicker/BoostPicker'
import * as style from './BuyBoostModal.module.scss'
import { CurrentView, BuyBoostModalOrigin } from './BuyBoostModalType'
import LeaderPicker from './LeaderPicker/LeaderPicker'
import { Boost } from 'types/Boost'
import Recap from './Recap/Recap'
import { CosmonType } from 'types/Cosmon'

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

interface BuyBoostModalProps {
  handleCloseModal: () => void
  origin: BuyBoostModalOrigin
}

const BuyBoostModal: React.FC<BuyBoostModalProps> = ({ handleCloseModal, origin }) => {
  const [currentView, setCurentView] = useState<CurrentView>('boost')
  const [selectedBoost, setSelectedBoost] = useState<Boost | null>(null)
  const [selectedLeaders, setSelectedLeaders] = useState<CosmonType[]>([])

  const handleSelectLeader = (leader: CosmonType | null) => {
    if (leader === null) {
      return setSelectedLeaders([])
    }

    const leaderIndex = selectedLeaders.findIndex(
      (selectedLeader) => selectedLeader.id === leader.id
    )
    const newArray = [...selectedLeaders]

    if (leaderIndex !== -1) {
      newArray.splice(leaderIndex, 1)
      return setSelectedLeaders(newArray)
    } else {
      return setSelectedLeaders([...selectedLeaders, leader])
    }
  }

  const handleKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        handleCloseModal()
      }
    },
    [handleCloseModal]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const closeModal = () => {
    handleCloseModal()
  }

  const resetModal = () => {
    setCurentView('boost')
    setSelectedLeaders([])
    setSelectedBoost(null)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'boost':
        return (
          <BoostPicker
            selectedBoost={selectedBoost}
            setSelectedBoost={setSelectedBoost}
            setCurrentView={setCurentView}
            origin={origin}
          />
        )
      case 'leader':
        return (
          <LeaderPicker
            selectedBoost={selectedBoost as Boost}
            setCurrentView={setCurentView}
            selectedLeaders={selectedLeaders}
            handleSelectLeader={handleSelectLeader}
          />
        )
      case 'recap':
        return (
          <Recap
            resetModal={resetModal}
            closeModal={closeModal}
            selectedLeaders={selectedLeaders}
            selectedBoost={selectedBoost as Boost}
          />
        )
    }
  }

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={style.overlay}
    >
      <div className={style.modal}>{renderCurrentView()}</div>
    </motion.div>
  )
}

BuyBoostModal.displayName = 'BuyBoostModal'

export default BuyBoostModal
