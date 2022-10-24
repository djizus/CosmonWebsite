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
  selectedLeader: CosmonType | null
  selectedBoost: Boost
  setSelectedLeader: Dispatch<SetStateAction<CosmonType | null>>
  setCurrentView: Dispatch<SetStateAction<CurrentView>>
}

const LeaderPicker: React.FC<LeaderPickerProps> = ({
  selectedLeader,
  selectedBoost,
  setSelectedLeader,
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
          const cosmonDecksName = decksList.reduce((acc, curr) => {
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
        return new RegExp(search, 'gi').test(cosmon.data.extension.name)
      })
  }, [cosmons, decksList, search])

  console.log(search, formatedAndFiltredCosmons)

  const BoostIcon = getIconForAttr(selectedBoost.name)

  return (
    <div className={style.container}>
      <p className={style.title}>Select the Leader</p>
      <div className={style.boostDetails}>
        <IconWithLabel Icon={BoostIcon} label={`+${selectedBoost.inc_value}`} />
        <IconWithLabel
          className={style.numberOfFights}
          Icon={() => <Flash />}
          label={`${selectedBoost.effect_time} Fights`}
        />
        <div className={style.price}>
          <img className={style.kiLogo} src="/xki-logo.png" style={{ width: 30, height: 30 }} />
          <span>
            {selectedBoost.price.amount} {selectedBoost.price.denom}
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
                className={clsx(style.card, {
                  [style.selectedCard]: cosmon.id === selectedLeader?.id,
                })}
                handleClick={setSelectedLeader}
                cosmon={cosmon}
                boost={selectedBoost}
              />
            ))}
          </div>
        </div>
      </div>
      <Button disabled={!selectedBoost || !selectedLeader} onClick={() => setCurrentView('recap')}>
        Buy {selectedBoost.name}
      </Button>
    </div>
  )
}

LeaderPicker.displayName = 'LeaderPicker'

export default LeaderPicker
