import InputText from '@components/Input/InputText'
import clsx from 'clsx'
import React from 'react'
import * as style from './LevelFilter.module.scss'
import { LevelFilterType } from 'types'
import HideableContent from '../HideableContent/HideableContent'
import Tooltip from '@components/Tooltip/Tooltip'

interface Props {
  levels: LevelFilterType
  onChangeLevel: (levels: LevelFilterType) => void
  disabled: boolean
  className?: string
}

const LevelFilter: React.FC<Props> = ({ levels, onChangeLevel, disabled, className }) => {
  return (
    <HideableContent title={'Level'} className={clsx(style.container, className)}>
      <div className={style.inputsContainer}>
        <div className={style.minInputContainer}>
          <p className={style.minLabel}>Min.</p>
          <div data-tip="tootlip" data-for={`disabled-min`}>
            <InputText
              type="number"
              className={clsx(style.input, {
                [style.disabled]: disabled,
              })}
              onChange={(event) =>
                onChangeLevel({
                  ...levels,
                  min: event.currentTarget.value,
                })
              }
              value={levels.min}
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
              type="number"
              className={clsx(style.input, {
                [style.disabled]: disabled,
              })}
              onChange={(event) =>
                onChangeLevel({
                  ...levels,
                  max: event.currentTarget.value,
                })
              }
              value={levels.max}
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

LevelFilter.displayName = 'LevelFilter'

export default LevelFilter
