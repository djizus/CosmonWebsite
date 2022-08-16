import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import { DeckBuilderContext } from './DeckBuilderContext'
import Close from '/public/icons/close-primary.svg'

interface DeckBuilderModalCloseButtonProps {}

const DeckBuilderModalCloseButton: React.FC<
  DeckBuilderModalCloseButtonProps
> = ({}) => {
  const { handleCloseModal } = useContext(DeckBuilderContext)
  return (
    <div className="flex flex-1 justify-end">
      <motion.button
        whileHover={{ rotate: '90deg' }}
        className="mr-[10px]"
        onClick={handleCloseModal}
      >
        <Close className="h-[24px] w-[24px]" />
      </motion.button>
    </div>
  )
}

export default DeckBuilderModalCloseButton
