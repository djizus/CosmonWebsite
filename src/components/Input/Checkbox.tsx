import clsx from 'clsx'
import React, { ReactNode, useCallback } from 'react'
import CheckIcon from '@public/icons/check.svg'
import * as styles from './Checkbox.module.scss'

interface CheckboxProps {
  labelPosition?: 'right' | 'left'
  label?: string | React.ReactNode
  checkboxClassName?: string
  children?: (renderCheckBox: () => ReactNode, renderLabel: () => ReactNode) => ReactNode
}

const Checkbox: React.FC<
  CheckboxProps &
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ label, labelPosition = 'right', children, checkboxClassName, ...props }) => {
  const renderCheckbox = useCallback(() => {
    return (
      <span
        className={clsx(
          styles.checkboxCustom,
          'bg-cosmon-main-primary',
          props.checked ? styles.checkboxCustomChecked : null,
          checkboxClassName
        )}
      >
        <CheckIcon />
      </span>
    )
  }, [props.checked])

  const renderLabel = useCallback(() => {
    return label ? (
      typeof label === 'string' ? (
        <span className={clsx(styles.checkboxLabel)}>{label}</span>
      ) : (
        label
      )
    ) : null
  }, [label])

  return (
    <label
      className={clsx(
        styles.checkbox,
        props.disabled ? styles.checkboxDisabled : null,
        props.className
      )}
    >
      <input type="checkbox" {...props} />
      {(children && children(renderCheckbox, renderLabel)) ||
        (labelPosition === 'right' ? (
          <>
            {renderCheckbox()}
            {renderLabel()}
          </>
        ) : (
          <>
            {renderLabel()}
            {renderCheckbox()}
          </>
        ))}
    </label>
  )
}

export default Checkbox
