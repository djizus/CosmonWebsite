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
      arrowColor="transparent"
      offset={{
        top: props.place === 'bottom' ? 8 : 0,
        bottom: props.place === 'top' ? 8 : 0,
        left: props.place === 'right' ? 8 : 0,
        right: props.place === 'left' ? 8 : 0,
      }}
      {...props}
    >
      {props.children}
    </ReactTooltip>
  )
}

export default Tooltip
