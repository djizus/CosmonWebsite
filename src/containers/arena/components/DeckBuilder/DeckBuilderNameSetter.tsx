import clsx from 'clsx'
import React, { ChangeEvent, useContext } from 'react'
import { useCallback } from 'react'
import { DeckBuilderContext } from './DeckBuilderContext'
import styles from './DeckBuilderNameSetter.module.scss'

interface DeckBuilderNameSetterProps {}

const DeckBuilderNameSetter: React.FC<DeckBuilderNameSetterProps> = ({}) => {
  const { deck, setDeck } = useContext(DeckBuilderContext)

  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDeck({ ...deck, name: e.target.value })
  }, [])

  return (
    <div className="flex flex-1">
      <input
        type="text"
        placeholder="Choose a team name"
        value={deck.name}
        onChange={handleChangeName}
        className={clsx(styles.inputNameSetter)}
      />
    </div>
  )
}

export default DeckBuilderNameSetter
