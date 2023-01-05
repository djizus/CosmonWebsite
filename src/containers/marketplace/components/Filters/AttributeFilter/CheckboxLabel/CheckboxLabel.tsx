import clsx from 'clsx'
import React from 'react'
import * as style from './CheckboxLabel.module.scss'

interface CheckBoxLabelProps {
  label: string
  className?: string
}

const CheckBoxLabel: React.FC<CheckBoxLabelProps> = ({ label, className }) => {
  return <span className={clsx(style.label, className)}>{label}</span>
}

CheckBoxLabel.displayName = 'CheckBoxLabel'

export default CheckBoxLabel
