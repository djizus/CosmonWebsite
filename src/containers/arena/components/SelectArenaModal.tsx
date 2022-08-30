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

        {arenasList.map((arena) => (
          <ArenaContainer
            key={arena.contract}
            arena={arena}
            isSelected={arena === internArena}
            onSelectArena={handleSelectFightMode}
          />
        ))}

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
              ? t('selectArenaModal.ctaFight')
              : t('selectArenaModal.ctaLearnMore')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default SelectArenaModal

const ArenaContainer: React.FC<{
  arena: ArenaType
  isSelected: boolean
  onSelectArena: (arena: ArenaType) => void
}> = ({ arena, isSelected, onSelectArena }) => {
  const { t } = useTranslation('arenas')

  const renderName = useMemo(() => {
    return (
      <span className="text-xl font-normal leading-6 text-white">
        <Trans i18nKey={`${camelCase(arena.name)}.name`} t={t} />
      </span>
    )
  }, [arena])

  return (
    <div
      className={clsx(
        'relative mt-[32px] flex cursor-pointer flex-col rounded-[20px] border border-[#9FA4DD] px-[40px] py-[24px] hover:bg-[#282255]',
        { 'bg-[#282255]': isSelected },
        { 'bg-transparent': isSelected === false },
        { 'cursor-not-allowed': arena.arena_open === false }
      )}
      onClick={() => {
        onSelectArena(arena)
      }}
    >
      {arena.arena_open === false ? (
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-[20px] bg-[#383856]/[0.9] backdrop-blur-[2px] ">
          <p className="text-3xl font-semibold text-white" style={{ transform: 'rotate(349deg)' }}>
            Coming soon
          </p>
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-[14px]">
        <span className="flex items-center justify-center rounded-[4px] bg-white p-[6px]">
          {arena.image_url ? (
            <img src={arena.image_url} className="h-[24px] w-[24px]" />
          ) : (
            <Shield />
          )}
        </span>
        {renderName}
      </div>
      <p className="mt-[16px] text-sm font-normal leading-6 text-white">
        <Trans i18nKey={`${camelCase(arena.name)}.description`} t={t} />
      </p>
    </div>
  )
}
