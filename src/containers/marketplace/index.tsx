import { useEffect, useMemo, useState } from 'react'
import ConnectionNeededContent from '@components/ConnectionNeededContent/ConnectionNeededContent'
import * as style from './style.module.scss'
import { useMarketPlaceStore } from '@store/marketPlaceStore'
import Header from './components/Header/Header'
import { useWalletStore } from '@store/walletStore'
import CosmonsList from './components/CosmonsList/CosmonsList'
import {
  CosmonType,
  Geographical,
  geographicals,
  LevelFilterType,
  MarketplaceSortOrder,
  personnalities,
  Personnality,
  PriceFilterType,
  scarcities,
  Scarcity,
  Time,
  times,
} from 'types'
import { useRouter } from 'next/router'
import Button from '@components/Button/Button'
import clsx from 'clsx'
import PriceFilter from './components/Filters/PriceFilter/PriceFilter'
import LevelFilter from './components/Filters/LevelFilter/LevelFilter'
import AttributeFilter from './components/Filters/AttributeFilter/AttributeFilter'
import Select, { OptionType } from '@components/Input/Select'
import NameAndIdFilter from './components/Filters/NameAndIdFilter/NameAndIdFilter'

interface MarketplaceProps {}

export const itemPerPage = 2
export type MarketPlaceListType = 'all' | 'mine'

const sortOrderOptions: OptionType[] = [
  {
    label: 'Price Low to High',
    value: 'low_to_high',
  },
  {
    label: 'Price High to Low',
    value: 'high_to_low',
  },
]

const Marketplace: React.FC<MarketplaceProps> = () => {
  const {
    filters,
    setFilters,
    clearFilters,
    fetchCosmonsForMarketPlace,
    fetchSellingNftFromAddress,
    fetchKPI,
    sortOrder,
    setOrder,
    floor,
    totalVolume,
    cosmonsInMarketplace,
    myListedCosmons,
    cosmonsForMarketPlaceLoading,
  } = useMarketPlaceStore()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const { isConnected, address } = useWalletStore()
  const [currentSection, setCurrentSection] = useState<MarketPlaceListType>('all')

  useEffect(() => {
    if (isConnected) {
      handleRefreshPageData(true)
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      handleRefreshPageData(true)
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected) {
      // we load next page only if needed
      fetchCosmonsForMarketPlace(itemPerPage, false)
    }
  }, [page])

  const handleClickShowDetails = (cosmon: CosmonType) => {
    router.push(`/marketplace/${cosmon.id}`)
  }

  const handleRefreshPageData = (init: boolean) => {
    if (address && isConnected) {
      fetchCosmonsForMarketPlace(itemPerPage, init)
      fetchKPI()
      fetchSellingNftFromAddress(address)
    }
  }

  const filtredCosmons = useMemo(() => {
    switch (currentSection) {
      case 'all': {
        return cosmonsInMarketplace.sort((a, b) => {
          if (sortOrder === 'high_to_low' && a.price && b.price) {
            return b.price - a.price
          }

          if (sortOrder === 'low_to_high' && a.price && b.price) {
            return a.price - b.price
          }

          return 0
        })
      }

      case 'mine': {
        return myListedCosmons
      }

      default: {
        return cosmonsInMarketplace
      }
    }
  }, [cosmonsInMarketplace, myListedCosmons, currentSection, page, sortOrder])

  const handleChangeScarcityFilter = (scarcity: Scarcity) => {
    const isTimeInFilterIndex = filters.scarcity.findIndex((filter) => filter === scarcity)
    const arrayToUpdate = filters.scarcity

    if (isTimeInFilterIndex !== -1) {
      arrayToUpdate.splice(isTimeInFilterIndex, 1)
    } else {
      arrayToUpdate.push(scarcity)
    }

    setFilters({
      ...filters,
      scarcity: arrayToUpdate,
    })
  }

  const handleChangeTimeFilter = (time: Time) => {
    const isTimeInFilterIndex = filters.time.findIndex((filter) => filter === time)
    const arrayToUpdate = filters.time

    if (isTimeInFilterIndex !== -1) {
      arrayToUpdate.splice(isTimeInFilterIndex, 1)
    } else {
      arrayToUpdate.push(time)
    }

    setFilters({
      ...filters,
      time: arrayToUpdate,
    })
  }

  const handleChangePersonnalityFilter = (personnality: Personnality) => {
    const isPersonnalityInFilterIndex = filters.personnality.findIndex(
      (filter) => filter === personnality
    )
    const arrayToUpdate = filters.personnality

    if (isPersonnalityInFilterIndex !== -1) {
      arrayToUpdate.splice(isPersonnalityInFilterIndex, 1)
    } else {
      arrayToUpdate.push(personnality)
    }

    setFilters({
      ...filters,
      personnality: arrayToUpdate,
    })
  }

  const handleChangeGeographicalFilter = (geographical: Geographical) => {
    const isTimeInFilterIndex = filters.geographical.findIndex((filter) => filter === geographical)
    const arrayToUpdate = filters.geographical

    if (isTimeInFilterIndex !== -1) {
      arrayToUpdate.splice(isTimeInFilterIndex, 1)
    } else {
      arrayToUpdate.push(geographical)
    }

    setFilters({
      ...filters,
      geographical: arrayToUpdate,
    })
  }

  const handleChangePriceFilter = (price: PriceFilterType) => {
    setFilters({
      ...filters,
      price,
    })
  }

  const handleChangeLevelFilter = (levels: LevelFilterType) => {
    setFilters({
      ...filters,
      levels,
    })
  }

  const handleChangeNameOrIdFilter = (value: number | string | null) => {
    if (typeof value === 'string') {
      setFilters({
        ...filters,
        name: value,
      })
    } else if (typeof value === 'number') {
      setFilters({
        ...filters,
        id: value,
      })
    } else {
      setFilters({
        ...filters,
        id: -1,
        name: '',
      })
    }
  }

  const handleClearAllFilters = async () => {
    await clearFilters()
    handleSubmitFilter()
  }

  const handleSubmitFilter = () => {
    fetchCosmonsForMarketPlace(itemPerPage, true)
  }

  return (
    <div className={style.container}>
      <ConnectionNeededContent>
        <Header
          className={style.header}
          floor={floor}
          totalVolume={totalVolume}
          items={cosmonsInMarketplace.length}
          collection={cosmonsInMarketplace[0]?.collection}
        />
        <div className={style.optionsContainer}>
          <Button
            className={clsx(style.button, {
              [style.activeButton]: currentSection === 'all',
            })}
            type="quaternary"
            size="small"
            onClick={() => setCurrentSection('all')}
          >
            {`All`}
          </Button>
          <Button
            className={clsx(style.button, style.buttonMargin, {
              [style.activeButton]: currentSection === 'mine',
            })}
            type="quaternary"
            size="small"
            onClick={() => setCurrentSection('mine')}
          >
            {`My listing (${myListedCosmons.length})`}
          </Button>
        </div>
        <div>
          {currentSection === 'all' ? (
            <div className={style.filtersContainer}>
              <div className={style.filterHeader}>
                <NameAndIdFilter
                  handleChangeNameOrIdFilter={handleChangeNameOrIdFilter}
                  name={filters.name}
                  id={filters.id}
                />
                <Select
                  className={style.selectSortOrder}
                  chevronClassName={style.chevron}
                  prefix={<span className={style.selectPrefix}>Sort:</span>}
                  selectOptionsClassName={style.selectOptionsSortOrder}
                  value={sortOrder}
                  options={sortOrderOptions}
                  placeholder="Sort"
                  onChange={(value) => setOrder(value as MarketplaceSortOrder)}
                />
              </div>
              <div className={style.listContainer}>
                <div className={style.filterSide}>
                  <div className={style.submitContainer}>
                    <Button
                      className={style.submitFilterButton}
                      type="secondary"
                      withoutContainer
                      onClick={handleSubmitFilter}
                    >
                      Apply filters
                    </Button>
                    <Button
                      onClick={handleClearAllFilters}
                      type="secondary"
                      withoutContainer
                      className={style.clearFilterButton}
                    >
                      Clear all filters
                    </Button>
                  </div>
                  <PriceFilter
                    className={style.priceFilter}
                    onChangePrice={handleChangePriceFilter}
                    prices={filters.price}
                  />
                  <AttributeFilter
                    className={style.scarcityFilter}
                    title="Scarcity"
                    onChangeFilter={handleChangeScarcityFilter}
                    filter={filters.scarcity}
                    options={scarcities}
                    defaultDisplay={true}
                  />
                  <LevelFilter
                    className={style.levelFilter}
                    onChangeLevel={handleChangeLevelFilter}
                    levels={filters.levels}
                  />
                  <AttributeFilter
                    className={style.personnalityFilter}
                    title="Type’s preference"
                    onChangeFilter={handleChangePersonnalityFilter}
                    filter={filters.personnality}
                    options={personnalities}
                  />
                  <AttributeFilter
                    className={style.timeFilter}
                    title="Time period"
                    onChangeFilter={handleChangeTimeFilter}
                    filter={filters.time}
                    options={times}
                  />
                  <AttributeFilter
                    title="Geographical Area"
                    onChangeFilter={handleChangeGeographicalFilter}
                    filter={filters.geographical}
                    options={geographicals}
                  />
                </div>
                <CosmonsList
                  page={page}
                  section={currentSection}
                  cosmons={filtredCosmons}
                  onChangePage={(value: number) => setPage(value)}
                  onClickShowDetails={handleClickShowDetails}
                  isListLoading={cosmonsForMarketPlaceLoading}
                />
              </div>
            </div>
          ) : (
            <CosmonsList
              page={page}
              section={currentSection}
              cosmons={filtredCosmons}
              onChangePage={(value: number) => setPage(value)}
              onClickShowDetails={handleClickShowDetails}
              isListLoading={cosmonsForMarketPlaceLoading}
            />
          )}
        </div>
      </ConnectionNeededContent>
    </div>
  )
}

Marketplace.displayName = 'Marketplace'

export default Marketplace
