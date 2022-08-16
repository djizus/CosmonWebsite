import { motion } from 'framer-motion'
import React, { useCallback } from 'react'
import { useState } from 'react'
import { CosmonType } from 'types/Cosmon'
import DeckBuilderContainer from './DeckBuilderContainer'
import { DeckBuilderContext, NftsListFilter } from './DeckBuilderContext'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useEffect } from 'react'
import { SCARCITIES } from 'types/Scarcity'
import { useWalletStore } from '@store/walletStore'
import { Deck } from '@services/deck'

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

interface DeckBuilderModalProps {
  deckToEdit?: Deck
  handleCloseModal: () => void
}

const DeckBuilderModal: React.FC<DeckBuilderModalProps> = ({
  deckToEdit,
  handleCloseModal,
}) => {
  const { cosmons, resetAllCosmonsTemporaryFree } = useWalletStore(
    (state) => state
  )
  const [affinities, setAffinities] = useState<any>([])
  const [deckName, setDeckName] = useState(deckToEdit?.name || '')
  const [nfts, setNfts] = useState<CosmonType[]>(cosmons)
  const [deck, setDeck] = useState<CosmonType[] | undefined[]>(
    deckToEdit?.cosmons || [undefined, undefined, undefined]
  )
  const [listFilter, setListFilter] = useState<NftsListFilter>({
    search: '',
    scarcities: [
      SCARCITIES.COMMON,
      SCARCITIES.UNCOMMON,
      SCARCITIES.RARE,
      SCARCITIES.EPIC,
      SCARCITIES.LEGENDARY,
    ],
    showStats: false,
    showUnused: true,
  })

  useEffect(() => {
    document.getElementsByTagName('html')[0].className = 'overflow-hidden'
    document.getElementsByTagName('body')[0].className = 'overflow-hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.getElementsByTagName('html')[0].className = ''
      document.getElementsByTagName('body')[0].className = ''
    }
  }, [])

  const handleKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        handleCloseModal()
      }
    },
    [handleCloseModal]
  )

  const closeModal = () => {
    handleCloseModal()
    setAffinities([])
    setDeckName('')
    setDeck([undefined, undefined, undefined])
    if (deckToEdit) {
      resetAllCosmonsTemporaryFree()
    }
  }

  return (
    <DeckBuilderContext.Provider
      value={{
        affinities,
        setAffinities,
        deckName,
        setDeckName,
        nfts,
        setNfts,
        listFilter,
        setListFilter,
        deck,
        setDeck,
        deckToEdit,
        handleCloseModal: closeModal,
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <Backdrop>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              width: '100%',
              height: '100%',
              margin: 'auto',
              overflowY: 'hidden',
            }}
          >
            <DeckBuilderContainer />
          </motion.div>
        </Backdrop>
      </DndProvider>
    </DeckBuilderContext.Provider>
  )
}

export default DeckBuilderModal

interface BackdropProps {
  children: React.ReactNode
}
const Backdrop: React.FC<BackdropProps> = ({ children }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        overflowY: 'hidden',
        zIndex: 1000,
      }}
    >
      {children}
    </div>
  )
}
