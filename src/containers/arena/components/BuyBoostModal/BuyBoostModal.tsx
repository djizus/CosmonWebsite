import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import BoostPicker from './BoostPicker/BoostPicker'
import * as style from './BuyBoostModal.module.scss'
import { CurrentView } from './BuyBoostModalType'

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
}

const BuyBoostModal: React.FC<BuyBoostModalProps> = ({ handleCloseModal }) => {
  const [currentView, setCurentView] = useState<CurrentView>('boost')
  const [selectedBoost, setSelectedBoost] = useState<string>('')

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

  const handleChangeView = (view: CurrentView) => {
    setCurentView(view)
  }

  const renderCurrentView = useMemo(() => {
    switch (currentView) {
      case 'boost':
        return <BoostPicker selectedBoost={selectedBoost} setSelectedBoost={setSelectedBoost} />
      case 'leader':
        return <p>LEADER</p>
      case 'recap':
        return <p>RECAP</p>
    }
  }, [currentView])

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={style.overlay}
    >
      <div className={style.modal}>{renderCurrentView}</div>
    </motion.div>
  )
}

BuyBoostModal.displayName = 'BuyBoostModal'

export default BuyBoostModal
