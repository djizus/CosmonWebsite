import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import Button from '@components/Button/Button'
import * as style from './LeaderPicker.module.scss'
import { Boost } from 'types/Boost'
import Flash from '@public/cosmons/stats/flash.svg'
import { CosmonTypeWithDecks, CurrentView } from '../BuyBoostModalType'
import IconWithLabel from '../IconWithLabel/IconWithLabel'
import { getIconForAttr, getPotionNameFromBoostedStat } from '@utils/boost'
import InputText from '@components/Input/InputText'
import Search from '@public/icons/search.svg'
import { useWalletStore } from '@store/walletStore'
import CardsWithStats from '../CardWithStats/CardWithStats'
import clsx from 'clsx'
import { convertMicroDenomToDenom } from '@utils/conversion'
import { useGameStore } from '@store/gameStore'

interface LeaderPickerProps {
  handleCloseModal: () => void
  selectedLeaders: CosmonTypeWithDecks[]
  cosmonsWithDeckInfo: CosmonTypeWithDecks[]
  selectedBoost: Boost
  handleSelectLeader: (leader: CosmonTypeWithDecks | null) => void
  setCurrentView: Dispatch<SetStateAction<CurrentView>>
}

const LeaderPicker: React.FC<LeaderPickerProps> = ({
  handleCloseModal,
  selectedLeaders,
  cosmonsWithDeckInfo,
  selectedBoost,
  handleSelectLeader,
  setCurrentView,
}) => {
  const [search, setSearch] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const { fetchCosmons } = useWalletStore()
  const { buyBoost } = useGameStore()

  useEffect(() => {
    fetchCosmons()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    if (selectedBoost) {
      await buyBoost(selectedLeaders[0], selectedBoost, handleCloseModal)
      setLoading(false)
      setCurrentView('recap')
    }
  }

  const filtredCosmons: CosmonTypeWithDecks[] = useMemo(() => {
    return cosmonsWithDeckInfo.filter((cosmon) => {
      const has3Boosts = !cosmon.boosts.some((boost) => boost === null)
      const filterByCosmonName = new RegExp(search, 'gi').test(cosmon.data.extension.name)
      const filterByDeckName = new RegExp(search, 'gi').test(cosmon.deckName)

      return (filterByCosmonName || filterByDeckName) && !has3Boosts
    })
  }, [cosmonsWithDeckInfo, search])

  const BoostIcon = getIconForAttr(selectedBoost.boost_name)

  return (
    <div className={style.container}>
      <p className={style.title}>Select the Leader</p>
      <div className={style.boostDetails}>
        <IconWithLabel
          className={style.boostIcon}
          Icon={BoostIcon}
          label={`+${selectedBoost.inc_value} %`}
        />
        <IconWithLabel
          className={style.numberOfFights}
          Icon={() => <Flash />}
          label={`${selectedBoost.effect_time} Fights`}
        />
        <div className={style.price}>
          <img className={style.kiLogo} src="/xki-logo.png" style={{ width: 30, height: 30 }} />
          <span>
            {Math.round(
              convertMicroDenomToDenom(selectedBoost.price.amount) * selectedLeaders.length * 10
            ) / 10}{' '}
            XKI
          </span>
        </div>
      </div>
      <div className={style.content}>
        <InputText
          borderClassName={style.inputTextBorder}
          className={style.searchInput}
          placeholder="Search"
          onChange={(e) => setSearch(e.currentTarget.value)}
          icon={{
            icon: <Search className={style.searchIcon} />,
            position: 'left',
          }}
        />
        {/* <div className={style.clearAllContent}>
          <p className={style.numberOfLeaders}>{selectedLeaders.length} leader(s) selected</p>
          <Button
            className={style.clearAllButton}
            type="ghost"
            disabled={selectedLeaders.length === 0}
            onClick={() => handleSelectLeader(null)}
          >
            Clear all
          </Button>
        </div> */}
        <div className={style.box}>
          <div>
            {filtredCosmons.map((cosmon) => (
              <CardsWithStats
                key={cosmon.id}
                className={clsx(style.card, {
                  [style.selectedCard]:
                    selectedLeaders.findIndex(
                      (selectedLeader) => cosmon.id === selectedLeader.id
                    ) !== -1,
                })}
                handleClick={handleSelectLeader}
                cosmon={cosmon}
                boost={selectedBoost}
                variation="leaderpicker"
              />
            ))}
          </div>
        </div>
      </div>
      <Button
        disabled={!selectedBoost || selectedLeaders.length <= 0}
        isLoading={loading}
        onClick={handleSubmit}
      >
        Buy {getPotionNameFromBoostedStat(selectedBoost.boost_name)}
      </Button>
    </div>
  )
}

LeaderPicker.displayName = 'LeaderPicker'

export default LeaderPicker
