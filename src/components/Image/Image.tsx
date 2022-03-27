// To use later for better code splitting

import NextImage from 'next/image'

type ImageProps = {
  src: string
  className?: string
  imgClassName?: string
  layout: string
}

export default function Image({
  src,
  className,
  imgClassName,
  layout,
  ...props
}: ImageProps) {
  return (
    <div className={`${className}`}>
      <NextImage src={src} className={imgClassName} {...props} />
    </div>
  )
}
