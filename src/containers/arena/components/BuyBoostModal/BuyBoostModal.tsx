import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import BoostPicker from './BoostPicker/BoostPicker'
import * as style from './BuyBoostModal.module.scss'
import { CurrentView, BuyBoostModalOrigin, CosmonTypeWithDecksAndBoosts } from './BuyBoostModalType'
import LeaderPicker from './LeaderPicker/LeaderPicker'
import { Boost } from 'types/Boost'
import Recap from './Recap/Recap'
import { useArenaStore } from '@store/arenaStore'
import { useDeckStore } from '@store/deckStore'
import { useWalletStore } from '@store/walletStore'
import { addBoostAndDeckToCosmon } from './BuyBoostModalUtils'

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
  const [selectedLeaders, setSelectedLeaders] = useState<CosmonTypeWithDecksAndBoosts[]>([])
  const [cosmonsWithDeckAndBoosts, setCosmonsWithDeckAndBoosts] = useState<
    CosmonTypeWithDecksAndBoosts[]
  >([])
  const { fetchBoosts, boostsAvailable, boostsForCosmons } = useArenaStore()
  const { fetchDecksList, decksList } = useDeckStore((state) => state)
  const { cosmons, fetchCosmons } = useWalletStore((state) => state)

  useEffect(() => {
    fetchBoosts()
    fetchDecksList()
    fetchCosmons()
  }, [])

  useEffect(() => {
    if (selectedLeaders.length > 0) {
      const updatedLeader = cosmonsWithDeckAndBoosts.find(
        (item) => item.id === selectedLeaders[0].id
      )

      if (updatedLeader) {
        setSelectedLeaders([updatedLeader])
      }
    }
  }, [cosmonsWithDeckAndBoosts, selectedLeaders])

  useEffect(() => {
    if (origin !== 'buyBoost' && cosmonsWithDeckAndBoosts) {
      const formatedOrigin: CosmonTypeWithDecksAndBoosts = cosmonsWithDeckAndBoosts.find(
        (item) => item.id === origin.id
      ) ?? {
        ...origin,
        deckName: '',
        deckId: -1,
        boosts: [null, null, null],
      }

      setSelectedLeaders([formatedOrigin])
    }
  }, [origin, cosmonsWithDeckAndBoosts])

  useEffect(() => {
    setCosmonsWithDeckAndBoosts(
      addBoostAndDeckToCosmon({
        cosmons,
        boostsForCosmons,
        decksList,
      })
    )
  }, [cosmons, decksList, boostsForCosmons])

  const handleSelectLeader = (leader: CosmonTypeWithDecksAndBoosts | null) => {
    if (leader === null) {
      return setSelectedLeaders([])
    }

    return setSelectedLeaders([leader])

    // @TODO we comment it because sm dont handle multi leadrs right now
    // const leaderIndex = selectedLeaders.findIndex(
    //   (selectedLeader) => selectedLeader.id === leader.id
    // )
    // const newArray = [...selectedLeaders]

    // if (leaderIndex !== -1) {
    //   newArray.splice(leaderIndex, 1)
    //   return setSelectedLeaders(newArray)
    // } else {
    //   return setSelectedLeaders([...selectedLeaders, leader])
    // }
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

  const resetModal = async () => {
    if (origin !== 'buyBoost') {
      const formatedOrigin: CosmonTypeWithDecksAndBoosts = cosmonsWithDeckAndBoosts.find(
        (item) => item.id === origin.id
      ) ?? {
        ...origin,
        deckName: '',
        deckId: -1,
        boosts: [null, null, null],
      }

      setCurentView('boost')
      setSelectedLeaders([formatedOrigin])
      setSelectedBoost(null)
    } else {
      setCurentView('boost')
      setSelectedLeaders([])
      setSelectedBoost(null)
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'boost':
        return (
          <BoostPicker
            boostsAvailable={boostsAvailable}
            selectedLeaders={selectedLeaders}
            selectedBoost={selectedBoost}
            setSelectedBoost={setSelectedBoost}
            setCurrentView={setCurentView}
            origin={origin}
            handleCloseModal={closeModal}
          />
        )
      case 'leader':
        return (
          <LeaderPicker
            handleCloseModal={closeModal}
            cosmonsWithDeckInfo={cosmonsWithDeckAndBoosts}
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
