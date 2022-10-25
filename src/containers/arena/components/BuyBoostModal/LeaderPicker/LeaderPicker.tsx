import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import Button from '@components/Button/Button'
import * as style from './LeaderPicker.module.scss'
import { Boost } from 'types/Boost'
import Flash from '@public/cosmons/stats/flash.svg'
import { CurrentView } from '../BuyBoostModalType'
import IconWithLabel from '../IconWithLabel/IconWithLabel'
import { getIconForAttr } from '@utils/boost'
import InputText from '@components/Input/InputText'
import Search from '@public/icons/search.svg'
import { useWalletStore } from '@store/walletStore'
import { useDeckStore } from '@store/deckStore'
import CardsWithStats from '../CardWithStats/CardWithStats'
import { CosmonType } from 'types/Cosmon'
import clsx from 'clsx'

interface LeaderPickerProps {
  selectedLeaders: CosmonType[]
  selectedBoost: Boost
  handleSelectLeader: (leader: CosmonType) => void
  setCurrentView: Dispatch<SetStateAction<CurrentView>>
}

const LeaderPicker: React.FC<LeaderPickerProps> = ({
  selectedLeaders,
  selectedBoost,
  handleSelectLeader,
  setCurrentView,
}) => {
  const [search, setSearch] = useState<string>('')
  const { cosmons, fetchCosmons } = useWalletStore((state) => state)
  const { fetchDecksList, decksList } = useDeckStore((state) => state)

  useEffect(() => {
    fetchCosmons()
    fetchDecksList()
  }, [])

  const formatedAndFiltredCosmons = useMemo(() => {
    return cosmons
      .map((c, i) => {
        if (c.isInDeck) {
          const cosmonDecksName = decksList.reduce((acc: string[], curr) => {
            const isCosmonInThisDeckIndex = curr.cosmons.findIndex((cosmon) => cosmon.id === c.id)

            if (isCosmonInThisDeckIndex !== -1) {
              return [...acc, curr.name]
            }

            return acc
          }, [])

          return {
            ...c,
            decksName: cosmonDecksName,
          }
        }

        return {
          ...c,
          decksName: [],
        }
      })
      .filter((cosmon) => {
        const filterByCosmonName = new RegExp(search, 'gi').test(cosmon.data.extension.name)
        const filterByDeckName = cosmon.decksName.some((deckName) =>
          new RegExp(search, 'gi').test(deckName)
        )

        return filterByCosmonName || filterByDeckName
      })
  }, [cosmons, decksList, search])

  const BoostIcon = getIconForAttr(selectedBoost.name)

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
            {parseInt(selectedBoost.price.amount) * selectedLeaders.length}{' '}
            {selectedBoost.price.denom}
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
        <div className={style.box}>
          <div>
            {formatedAndFiltredCosmons.map((cosmon) => (
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
              />
            ))}
          </div>
        </div>
      </div>
      <Button
        disabled={!selectedBoost || selectedLeaders.length <= 0}
        onClick={() => setCurrentView('recap')}
      >
        Buy {selectedBoost.name}
      </Button>
    </div>
  )
}

LeaderPicker.displayName = 'LeaderPicker'

export default LeaderPicker
