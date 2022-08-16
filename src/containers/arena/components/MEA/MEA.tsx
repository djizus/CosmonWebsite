import { motion } from 'framer-motion'
import React from 'react'

interface MEAProps {
  title: string
  link: string
  subtitle?: string
  imgSrc: string
}

const MEA: React.FC<MEAProps> = ({ title, subtitle, link, imgSrc }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.99 }}
      className="flex flex-col items-start"
    >
      <a href={link} target={'_blank'}>
        <img
          src={imgSrc}
          style={{
            objectFit: 'contain',
            borderRadius: 16,
            height: 210,
          }}
        />
        <div className="mt-[15px]">
          <p className="text-left text-[20px] font-semibold leading-[32px] text-white">
            {title}
          </p>
          {subtitle ? (
            <p className="text-left text-[14px] font-semibold leading-[18px] text-white">
              {subtitle}
            </p>
          ) : null}
        </div>
      </a>
    </motion.div>
  )
}

export default MEA
