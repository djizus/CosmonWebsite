import clsx from 'clsx'
import React from 'react'

interface NFTNameProps {
  name: string
}

const NFTName: React.FC<
  NFTNameProps &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >
> = ({ name, ...props }) => {
  return (
    <p
      className={clsx([
        'text-left text-sm font-semibold text-cosmon-main-secondary',
        props.className,
      ])}
      {...props}
    >
      {name}
    </p>
  )
}

export default NFTName
