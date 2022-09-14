import clsx from 'clsx'
import React, { ReactNode, useRef } from 'react'
import { useHover } from 'usehooks-ts'
import styles from './Hexagon.module.scss'

export interface HexagonProps {
  children?: ReactNode
  width?: number
  height?: number
  reverseHover?: boolean
}

const Hexagon: React.FC<HexagonProps> = ({
  children,
  width = 200,
  height = 200,
  reverseHover = false,
}) => {
  const elRef = useRef<HTMLDivElement>(null)
  const isHovered = useHover(elRef)

  return (
    <div
      ref={elRef}
      className={clsx(styles.hexagon, {
        [styles.hexagonPlain]: (reverseHover && isHovered) || (!reverseHover && !isHovered),
        [styles.hexagonEmpty]: (reverseHover && !isHovered) || (!reverseHover && isHovered),
      })}
      style={{ width, height }}
    >
      <div className={`z-5 absolute top-0 left-0 flex h-full w-full items-center justify-center`}>
        {children}
      </div>
      {
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 9,
            background: '#191A20',
            opacity: 0.1,
            transform: 'matrix(0.6, -0.8, 0.8, 0.6, 0, 0)',
            width: 71,
            height: 34,
          }}
        />
      }
    </div>
  )
}

export default Hexagon
