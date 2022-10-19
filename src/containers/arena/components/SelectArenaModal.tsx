import Button from '@components/Button/Button'
import Modal from '@components/Modal/Modal'
import React, { useCallback, useEffect, useState } from 'react'
import Shield from '@public/cosmons/stats/shield.svg'
import clsx from 'clsx'
import { ArenaType } from 'types/Arena'
import { useGameStore } from '@store/gameStore'
import { useTranslation } from '@services/translations'
import { camelCase } from 'lodash'
import { useMemo } from 'react'
import { Trans } from 'react-i18next'
import Countdown from '@components/Countdown/Countdown'
import { convertMicroDenomToDenom } from '@utils/conversion'
import { useArenaStore } from '@store/arenaStore'
import { useWalletStore } from '@store/walletStore'
import * as style from './SelectArenaModal.module.scss'
interface SelectArenaModalProps {
  loading?: boolean
  selectedArena?: ArenaType
  onSelectArena: (selectedArena: ArenaType) => void
  onCloseModal: () => void
}

const SelectArenaModal: React.FC<SelectArenaModalProps> = ({
  loading,
  selectedArena,
  onSelectArena,
  onCloseModal,
}) => {
  const { t } = useTranslation('arena')
  const { arenasList } = useGameStore()

  const [internArena, setInternArena] = useState<ArenaType | undefined>()

  useEffect(() => {
    if (selectedArena) {
      setInternArena(selectedArena)
    }
  }, [selectedArena])

  const handleSelectFightMode = useCallback((arena: ArenaType) => {
    setInternArena(arena)
  }, [])

  const onClickCTA = useCallback(() => {
    if (internArena) {
      onSelectArena(internArena)
    }
  }, [internArena])

  return (
    <Modal onCloseModal={onCloseModal} hasCloseButton={false}>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl font-semibold text-white">{t('selectArenaModal.title')}</p>

        {arenasList
          ?.map((arena) => (
            <ArenaContainer
              key={arena.contract}
              arena={arena}
              isSelected={arena === internArena}
              onSelectArena={handleSelectFightMode}
            />
          ))
          .reverse()}

        <div
          className="mt-[40px] flex gap-[40px]"
          data-tip="tootlip"
          data-for={'select-fight-mode'}
        >
          <Button
            type="primary"
            size="small"
            onClick={onClickCTA}
            disabled={internArena === undefined}
          >
            {internArena === undefined
              ? t('selectArenaModal.ctaSelectArena')
              : internArena.registeredIn
              ? internArena.combat_price?.amount
                ? t('selectArenaModal.ctaFightWithPrice', {
                    price: convertMicroDenomToDenom(internArena.combat_price.amount),
                  })
                : t('selectArenaModal.ctaFight')
              : t('selectArenaModal.ctaLearnMore')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
SelectArenaModal.displayName = 'SelectArenaModal'
export default SelectArenaModal

const ArenaContainer: React.FC<{
  arena: ArenaType
  isSelected: boolean
  onSelectArena: (arena: ArenaType) => void
}> = ({ arena, isSelected, onSelectArena }) => {
  const { t } = useTranslation('arenas')
  const [nextLeagueStartDate, setNextLeagueStartDate] = useState<Date>()

  const {
    fetchDailyCombat,
    currentLeaguePro,
    fetchMaxDailyCombat,
    dailyCombatLimit,
    maxDailyCombatLimit,
  } = useArenaStore()
  const { address } = useWalletStore()

  useEffect(() => {
    if (currentLeaguePro) {
      fetchDailyCombat(currentLeaguePro.contract, address)
      fetchMaxDailyCombat(currentLeaguePro.contract)
    }
  }, [])

  const renderName = useMemo(() => {
    return (
      <span className="text-[18px] font-normal leading-6 text-white lg:text-xl">
        <Trans i18nKey={`${camelCase(arena.name)}.name`} t={t} />
      </span>
    )
  }, [arena])

  useEffect(() => {
    if (arena && arena.arena_open === false && arena.arena_open_time) {
      const startTimestamp = arena.arena_open_time
      const startEpoch = new Date(0)
      startEpoch.setUTCSeconds(startTimestamp)
      setNextLeagueStartDate(startEpoch)
    }
  }, [arena])

  const isTrainingMode = arena.name == 'Training'
  const notAllowed =
    arena.arena_open === false || (maxDailyCombatLimit === dailyCombatLimit && !isTrainingMode)

  const now = new Date()
  const getNextRefill = () => {
    const date = new Date()

    if (now.getUTCHours() >= 16) {
      date.setDate(now.getUTCDay() + 1)
      date.setUTCHours(16, 0, 0)
    } else if (now.getUTCHours() < 16) {
      date.setUTCHours(16, 0, 0)
    }

    return date
  }

  return (
    <>
      <div
        className={clsx(
          'relative mt-[32px] flex w-full cursor-pointer flex-col rounded-[20px] border border-[#9FA4DD] px-[40px] py-[24px]',
          {
            'bg-[#282255]': isSelected,
            'hover:bg-[#282255]': arena.arena_open === true,
            'cursor-not-allowed': notAllowed,
            'bg-transparent': isSelected === false,
            'border-none': dailyCombatLimit === maxDailyCombatLimit && !isTrainingMode,
          }
        )}
        onClick={() => {
          if (isTrainingMode) {
            if (arena.arena_open) {
              onSelectArena(arena)
            }
          } else {
            if (arena.arena_open && maxDailyCombatLimit !== dailyCombatLimit && !isTrainingMode) {
              onSelectArena(arena)
            }
          }
        }}
      >
        {arena.arena_open === false ? (
          <>
            <div className="absolute top-0 left-0 flex h-full w-full rounded-[20px] bg-[#383856]/[0.9] backdrop-blur-[4px]" />
            <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center  ">
              <p className="text-3xl font-semibold text-white">
                {nextLeagueStartDate ? (
                  <Countdown
                    from={new Date()}
                    to={nextLeagueStartDate}
                    className="text-[34px] font-extrabold italic text-white"
                  />
                ) : (
                  'Coming soon'
                )}
              </p>
              <p className="mt-[16px] text-[20px] font-semibold text-[#9FA4DD]">
                Championship starts in
              </p>
            </div>
          </>
        ) : null}
        {arena.name != 'Training' && (
          <span className={style.combatLimitCounter}>
            <span className={style.fire}>💥</span>
            {dailyCombatLimit} / {maxDailyCombatLimit}
          </span>
        )}

        <div className="flex items-center justify-center gap-[14px]">
          <span className="flex items-center justify-center rounded-[4px] p-[6px]">
            {arena.image_url ? (
              <img src={arena.image_url} className="h-[41px] w-[37px]" />
            ) : (
              <Shield />
            )}
          </span>
          {renderName}
        </div>
        <p className="mt-[16px] text-sm font-normal leading-6 text-white">
          <Trans i18nKey={`${camelCase(arena.name)}.description`} t={t} />
        </p>
        {dailyCombatLimit === maxDailyCombatLimit && !isTrainingMode && (
          <div className={style.combatLimitOverlay}>
            <p className={style.combatLimit}>
              💥 {dailyCombatLimit}/{maxDailyCombatLimit}
            </p>
            <p className={style.combatLimitMessage}>
              You reached the maximum number of fights you can do in 24h. Please wait until the next
              refill:
            </p>
            <Countdown className={style.countdown} from={now} to={getNextRefill()} />
          </div>
        )}
      </div>
    </>
  )
}
