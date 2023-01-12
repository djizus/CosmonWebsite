import InputText from '@components/Input/InputText'
import clsx from 'clsx'
import React from 'react'
import * as style from './PriceFilter.module.scss'
import { PriceFilterType } from 'types'
import HideableContent from '../HideableContent/HideableContent'
import Tooltip from '@components/Tooltip/Tooltip'

interface Props {
  prices: PriceFilterType
  onChangePrice: (prices: PriceFilterType) => void
  disabled: boolean
  className?: string
}

const PriceFilter: React.FC<Props> = ({ prices, onChangePrice, disabled, className }) => {
  return (
    <HideableContent defaultDisplay className={clsx(style.container, className)} title="Price">
      <div className={style.inputsContainer}>
        <div className={style.minInputContainer}>
          <p className={style.minLabel}>Min.</p>
          <div data-tip="tootlip" data-for={`disabled-min`}>
            <InputText
              disabled={disabled}
              className={clsx(style.input, {
                [style.disabled]: disabled,
              })}
              onChange={(event) =>
                onChangePrice({
                  ...prices,
                  min: event.currentTarget.value,
                })
              }
              value={prices.min}
            />
            {disabled ? (
              <Tooltip id={`disabled-min`} place="bottom">
                <p>
                  You can just apply one filter per time, please clear the actual one and select a
                  new one later
                </p>
              </Tooltip>
            ) : null}
          </div>
        </div>
        <div className={style.maxInputContainer}>
          <p className={style.maxLabel}>Max.</p>
          <div data-tip="tootlip" data-for={`disabled-max`}>
            <InputText
              disabled={disabled}
              className={clsx(style.input, {
                [style.disabled]: disabled,
              })}
              onChange={(event) =>
                onChangePrice({
                  ...prices,
                  max: event.currentTarget.value,
                })
              }
              value={prices.max}
            />
            {disabled ? (
              <Tooltip id={`disabled-max`} place="bottom">
                <p>
                  You can just apply one filter per time, please clear the actual one and select a
                  new one later
                </p>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </div>
    </HideableContent>
  )
}

PriceFilter.displayName = 'PriceFilter'

export default PriceFilter
