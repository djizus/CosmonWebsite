import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { useToggle } from 'react-use'
import Checkbox from './Checkbox'
import styles from './Select.module.scss'
import ChevronUp from '@public/icons/chevron-up.svg'

export type OptionType = {
  value: string
  label: string | ReactNode
}

interface SelectProps {
  value: string | string[] | undefined
  options: OptionType[]
  placeholder: string | React.ReactNode
  onChange: (value: string | string[]) => void
  className?: string
  selectOptionsClassName?: string
}

const dropIn = {
  hidden: {
    y: '10%',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '10%',
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
}

const Select: React.FC<SelectProps> = ({
  value,
  options,
  placeholder,
  className,
  selectOptionsClassName,
  onChange,
}) => {
  const [isOptionsContainerOpen, toggleOptionsContainerOpen] = useToggle(false)

  const isMultiple = useMemo(() => {
    return Array.isArray(value)
  }, [value])

  const selectedLabel = useMemo(() => {
    return !isMultiple
      ? options.find((o) => o.value === value)?.label
      : `${placeholder} (${value?.length})`
  }, [value, options, isMultiple])

  const handleCheckOption = (option: OptionType, checked: boolean) => {
    if (checked) {
      onChange([...(value as string[]), option.value])
      return
    }
    onChange([...(value as string[]).filter((v) => v !== option.value)])
    return
  }

  const selectValue = useCallback((option: OptionType) => {
    onChange(option.value)
    toggleOptionsContainerOpen()
  }, [])

  return (
    <div className={clsx(styles.selectContainer, className)}>
      <div className={clsx(styles.selectToggleContainer)} onClick={toggleOptionsContainerOpen}>
        <p className="text-sm font-semibold text-cosmon-main-primary">
          {!value || (isMultiple && value.length <= 0) ? placeholder : selectedLabel}
        </p>
        <ChevronUp
          className={styles.chevron}
          style={{
            transform: !isOptionsContainerOpen ? 'rotate(180deg)' : null,
          }}
        />
      </div>
      <AnimatePresence>
        {isOptionsContainerOpen ? (
          <motion.div
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={clsx(styles.selectOptionsContainer, selectOptionsClassName)}
          >
            {options.map((option, i) => (
              <div
                key={i + '-' + option.value}
                className={clsx(styles.selectableOptionContainer, 'flex')}
              >
                {isMultiple ? (
                  <Checkbox
                    label={option.label}
                    checked={value?.includes(option.value)}
                    onChange={(e) => {
                      handleCheckOption(option, e.target.checked)
                    }}
                    className="w-full"
                  >
                    {(renderCheckBox, renderLabel) => (
                      <div className="flex w-full items-center justify-between">
                        {renderLabel()}
                        {renderCheckBox()}
                      </div>
                    )}
                  </Checkbox>
                ) : (
                  <div
                    className={clsx('mb-[5px] flex flex-1 cursor-pointer')}
                    onClick={() => {
                      selectValue(option)
                    }}
                  >
                    {typeof option.label === 'string' ? (
                      <p
                        className={clsx(
                          {
                            [styles.selectableOptionSelected]: value === option.value,
                          },
                          'text-xs font-medium text-cosmon-black-8 '
                        )}
                      >
                        {option.label}
                      </p>
                    ) : (
                      option.label
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default Select
