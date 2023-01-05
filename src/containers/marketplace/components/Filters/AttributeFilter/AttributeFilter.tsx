import clsx from 'clsx'
import React, { useState } from 'react'
import * as style from './AttributeFilter.module.scss'
import Checkbox from '@components/Input/Checkbox'
import CheckBoxLabel from './CheckboxLabel/CheckboxLabel'
import Chevron from '/public/icons/chevron-up.svg'
import HideableContent from '../HideableContent/HideableContent'

interface Props<T> {
  title: string
  filter: T[]
  options: T[]
  onChangeFilter: (filter: T) => void
  defaultDisplay?: boolean
  className?: string
}

function AttributeFilter<T extends string>({
  title,
  options,
  filter,
  onChangeFilter,
  defaultDisplay = false,
  className,
}: Props<T>) {
  return (
    <HideableContent defaultDisplay={defaultDisplay} className={className} title={title}>
      {options.map((option, index) => {
        const isChecked = filter.some((item) => item === option)

        return (
          <Checkbox
            key={`${option}-${index}`}
            className={style.checkboxContainer}
            checkboxClassName={style.checkbox}
            checked={isChecked}
            labelPosition="left"
            label={<CheckBoxLabel label={option} />}
            onClick={() => onChangeFilter(option)}
          />
        )
      })}
    </HideableContent>
  )
}

export default AttributeFilter
