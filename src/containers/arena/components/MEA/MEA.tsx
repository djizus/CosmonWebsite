import React from 'react'

interface MEAProps {
  title: string
  subtitle: string
  imgSrc: string
}

const MEA: React.FC<MEAProps> = ({ title, subtitle, imgSrc }) => {
  return (
    <div className="flex flex-col">
      <img
        src={imgSrc}
        style={{
          objectFit: 'contain',
          height: 210,
        }}
      />
      <div className="mt-[15px]">
        <p className="text-left text-[20px] font-semibold leading-[32px] text-white">
          {title}
        </p>
        <p className="text-left text-[14px] font-semibold leading-[18px] text-white">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default MEA
