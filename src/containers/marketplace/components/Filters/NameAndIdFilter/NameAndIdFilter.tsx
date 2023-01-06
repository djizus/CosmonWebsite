import InputText from '@components/Input/InputText'
import { useOutsideAlerter } from '@hooks/useOutsideClick'
import { characterOptions, indexByCharacter } from '@utils/cosmon'
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import * as style from './NameAndIdFilter.module.scss'

interface Props {
  name: string
  id: number
  handleChangeNameOrIdFilter: (value: string | number | null) => void
}

const NameAndIdFilter: React.FC<Props> = ({ name, id, handleChangeNameOrIdFilter }) => {
  const [search, setSearch] = useState('')
  const [displayDropdown, setDisplayDropdown] = useState(false)

  const wrapperRef = useRef(null)
  const clickOutside = useOutsideAlerter(wrapperRef)

  useEffect(() => {
    if (clickOutside) {
      setDisplayDropdown(false)

      if (!/^\d/.test(search) && indexByCharacter(search) === -1) {
        setSearch('')
        handleChangeNameOrIdFilter(null)
      }
    }
  }, [clickOutside])

  useEffect(() => {
    if (name !== '') {
      setSearch(name)
    } else if (id !== -1) {
      setSearch(id.toString())
    }
  }, [name, id])

  const filtredOptions = useMemo(
    () =>
      characterOptions.filter((option) => option.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const isOnlyNumber = useMemo(() => /^\d/.test(search), [search])

  const handleClickOption = (option: { name: string; value: number }) => {
    handleChangeNameOrIdFilter(option.name)
    setDisplayDropdown(false)
  }

  const handleFocus = () => {
    setDisplayDropdown(!displayDropdown)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!displayDropdown) {
      setDisplayDropdown(true)
    }

    if (e.currentTarget.value === '') {
      handleChangeNameOrIdFilter(null)
      setSearch('')
    } else if (/^\d/.test(e.currentTarget.value)) {
      handleChangeNameOrIdFilter(parseInt(e.currentTarget.value))
    } else {
      setSearch(e.currentTarget.value)
    }
  }

  return (
    <div ref={wrapperRef} className={style.nameAndIdInputContainer}>
      <InputText
        value={search}
        onFocus={handleFocus}
        placeholder="Token ID or name"
        onChange={handleSearch}
        className={style.nameInput}
      />
      {!isOnlyNumber && displayDropdown && (
        <>
          <ul className={style.dropdownContainer}>
            {filtredOptions.map((option) => (
              <li
                className={style.optionLabel}
                onClick={() => handleClickOption(option)}
                key={option.value}
              >
                <span>{option.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

NameAndIdFilter.displayName = 'NameAndIdFilter'

export default NameAndIdFilter
