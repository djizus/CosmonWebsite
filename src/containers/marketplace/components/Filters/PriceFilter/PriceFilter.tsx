import InputText from '@components/Input/InputText'
import clsx from 'clsx'
import React from 'react'
import * as style from './PriceFilter.module.scss'
import { PriceFilterType } from 'types'
import HideableContent from '../HideableContent/HideableContent'

interface Props {
  prices: PriceFilterType
  onChangePrice: (prices: PriceFilterType) => void
  className?: string
}

const PriceFilter: React.FC<Props> = ({ prices, onChangePrice, className }) => {
  return (
    <HideableContent defaultDisplay className={clsx(style.container, className)} title="Price">
      <div className={style.inputsContainer}>
        <div className={style.minInputContainer}>
          <p className={style.minLabel}>Min.</p>
          <InputText
            className={style.input}
            onChange={(event) =>
              onChangePrice({
                ...prices,
                min: event.currentTarget.value,
              })
            }
            value={prices.min}
          />
        </div>
        <div className={style.maxInputContainer}>
          <p className={style.maxLabel}>Max.</p>
          <InputText
            className={style.input}
            onChange={(event) =>
              onChangePrice({
                ...prices,
                max: event.currentTarget.value,
              })
            }
            value={prices.max}
          />
        </div>
      </div>
    </HideableContent>
  )
}

PriceFilter.displayName = 'PriceFilter'

export default PriceFilter
