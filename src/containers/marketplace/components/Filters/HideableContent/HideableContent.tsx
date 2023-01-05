import clsx from 'clsx'
import React, { useState } from 'react'
import * as style from './HideableContent.module.scss'
import Checkbox from '@components/Input/Checkbox'
import Chevron from '/public/icons/chevron-up.svg'

interface Props {
  title: string
  defaultDisplay?: boolean
  className?: string
}

const HideableContent: React.FC<Props> = ({
  title,
  defaultDisplay = false,
  className,
  children,
}) => {
  const [display, setDisplay] = useState(defaultDisplay)

  return (
    <div
      className={clsx(
        style.container,
        {
          [style.show]: display,
        },
        className
      )}
    >
      <div onClick={() => setDisplay((display) => !display)} className={style.header}>
        <p className={style.title}>{title}</p>
        <Chevron
          className={clsx(style.chevron, {
            [style.chevronUp]: display,
          })}
        />
      </div>
      {children}
    </div>
  )
}

export default HideableContent
