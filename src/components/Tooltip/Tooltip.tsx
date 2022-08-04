import React from 'react'
import styles from './Tooltip.module.scss'
import clsx from 'clsx'
import ReactTooltip, { TooltipProps as ReactTooltipProps } from 'react-tooltip'

interface TooltipProps {}

const Tooltip: React.FC<TooltipProps & ReactTooltipProps> = ({ ...props }) => {
  return (
    <ReactTooltip
      className={clsx(styles.tooltipContainer, props.className)}
      effect="solid"
      place="bottom"
      offset={{ top: 10 }}
      {...props}
    >
      {props.children}
    </ReactTooltip>
  )
}

export default Tooltip
