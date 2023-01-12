import clsx from 'clsx'
import React, { useState } from 'react'
import * as style from './AttributeFilter.module.scss'
import Checkbox from '@components/Input/Checkbox'
import CheckBoxLabel from './CheckboxLabel/CheckboxLabel'
import HideableContent from '../HideableContent/HideableContent'
import Tooltip from '@components/Tooltip/Tooltip'

interface Props<T> {
  title: string
  filter: T[]
  options: T[]
  onChangeFilter: (filter: T) => void
  disabled: boolean
  defaultDisplay?: boolean
  className?: string
}

function AttributeFilter<T extends string>({
  title,
  options,
  filter,
  onChangeFilter,
  defaultDisplay = false,
  disabled,
  className,
}: Props<T>) {
  return (
    <HideableContent defaultDisplay={defaultDisplay} className={className} title={title}>
      {options.map((option, index) => {
        const isChecked = filter.some((item) => item === option)

        return (
          <div
            className={style.container}
            data-tip="tootlip"
            data-for={`disabled-${option}-${index}`}
          >
            <Checkbox
              disabled={disabled}
              key={`${option}-${index}`}
              className={style.checkboxContainer}
              checkboxClassName={clsx(style.checkbox, {
                [style.disabled]: disabled,
              })}
              checked={isChecked}
              labelPosition="left"
              label={<CheckBoxLabel label={option} />}
              onClick={() => onChangeFilter(option)}
            />
            {disabled ? (
              <Tooltip id={`disabled-${option}-${index}`} place="bottom">
                <p>
                  You can just apply one filter per time, please clear the actual one and select a
                  new one later
                </p>
              </Tooltip>
            ) : null}
          </div>
        )
      })}
    </HideableContent>
  )
}

export default AttributeFilter
