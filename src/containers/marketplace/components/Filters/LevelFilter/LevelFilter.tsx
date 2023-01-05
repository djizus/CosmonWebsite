import InputText from '@components/Input/InputText'
import clsx from 'clsx'
import React from 'react'
import * as style from './LevelFilter.module.scss'
import { LevelFilterType } from 'types'
import HideableContent from '../HideableContent/HideableContent'

interface Props {
  levels: LevelFilterType
  onChangeLevel: (levels: LevelFilterType) => void
  className?: string
}

const LevelFilter: React.FC<Props> = ({ levels, onChangeLevel, className }) => {
  return (
    <HideableContent title={'Level'} className={clsx(style.container, className)}>
      <div className={style.inputsContainer}>
        <div className={style.minInputContainer}>
          <p className={style.minLabel}>Min.</p>
          <InputText
            type="number"
            className={style.input}
            onChange={(event) =>
              onChangeLevel({
                ...levels,
                min: event.currentTarget.value,
              })
            }
            value={levels.min}
          />
        </div>
        <div className={style.maxInputContainer}>
          <p className={style.maxLabel}>Max.</p>
          <InputText
            type="number"
            className={style.input}
            onChange={(event) =>
              onChangeLevel({
                ...levels,
                max: event.currentTarget.value,
              })
            }
            value={levels.max}
          />
        </div>
      </div>
    </HideableContent>
  )
}

LevelFilter.displayName = 'LevelFilter'

export default LevelFilter
