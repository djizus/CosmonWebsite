import clsx from 'clsx'
import React, { ReactNode, useCallback } from 'react'
import CheckIcon from '@public/icons/check.svg'
import styles from './Checkbox.module.scss'

interface CheckboxProps {
  label?: string | React.ReactNode
  children?: (
    renderCheckBox: () => ReactNode,
    renderLabel: () => ReactNode
  ) => ReactNode
}

const Checkbox: React.FC<
  CheckboxProps &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
> = ({ label, children, ...props }) => {
  const renderCheckbox = useCallback(() => {
    return (
      <span
        className={clsx(
          styles.checkboxCustom,
          'bg-cosmon-main-primary',
          props.checked ? styles.checkboxCustomChecked : null
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
      {(children && children(renderCheckbox, renderLabel)) || (
        <>
          {renderCheckbox()}
          {renderLabel()}
        </>
      )}
    </label>
  )
}

export default Checkbox
