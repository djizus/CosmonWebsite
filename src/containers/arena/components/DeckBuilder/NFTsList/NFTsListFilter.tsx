import InputText from '@components/Input/InputText'
import React, { ChangeEvent, useCallback, useContext, useState } from 'react'
import Search from '@public/icons/search.svg'
import Checkbox from '@components/Input/Checkbox'
import Select from '@components/Input/Select'
import { scarcities } from 'types'
import { DeckBuilderContext } from '../DeckBuilderContext'

interface NFTsListFilterProps {}

const NFTsListFilter: React.FC<NFTsListFilterProps> = ({}) => {
  const { listFilter, setListFilter } = useContext(DeckBuilderContext)

  const handleChangeShowUsed = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setListFilter({ ...listFilter, showUnused: e.target.checked })
    },
    [listFilter]
  )

  const handleChangeShowStats = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setListFilter({ ...listFilter, showStats: e.target.checked })
    },
    [listFilter]
  )

  const handleChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setListFilter({ ...listFilter, search: e.target.value })
    },
    [listFilter]
  )

  const handleChangeScarcity = useCallback(
    (value) => {
      setListFilter({ ...listFilter, scarcities: value })
    },
    [listFilter]
  )

  return (
    <div className="flex flex-1 flex-col p-[12px]">
      <InputText
        className="w-full"
        placeholder="Search"
        onChange={handleChangeSearch}
        icon={{
          icon: <Search style={{ color: '#20164F' }} className="h-[24px] w-[24px]" />,
          position: 'left',
        }}
      />
      <div className="mt-[16px] flex flex-row items-center justify-between ">
        <div className="flex flex-row">
          <div className="flex">
            <Checkbox
              label="Unused"
              checked={listFilter.showUnused}
              onChange={handleChangeShowUsed}
            />
          </div>
          <div className="ml-[20px] flex">
            <Checkbox
              label="Stats"
              checked={listFilter.showStats}
              onChange={handleChangeShowStats}
            />
          </div>
        </div>
        <div>
          <Select
            className="w-[140px]"
            value={listFilter.scarcities}
            options={scarcities.map((s) => ({
              label: (
                <div className="flex items-center">
                  <img width={40} height={40} src={`/rarity-levels/${s.toLowerCase()}.png`} />
                  <p className="ml-[4px] text-xs font-medium text-cosmon-black-8">{s}</p>
                </div>
              ),
              value: s,
            }))}
            placeholder="Rarity"
            onChange={handleChangeScarcity}
          />
        </div>
      </div>
    </div>
  )
}

export default NFTsListFilter
