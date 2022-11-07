import { motion } from 'framer-motion'
import React from 'react'

interface MEAProps {
  link: string
  imgSrc: string
}

const MEA: React.FC<MEAProps> = ({ link, imgSrc }) => {
  return (
    <motion.div whileHover={{ scale: 0.99 }} className="flex flex-col items-start">
      <a href={link} target={'_blank'}>
        <img
          src={imgSrc}
          style={{
            objectFit: 'contain',
            borderRadius: 16,
            maxHeight: 235,
          }}
        />
      </a>
    </motion.div>
  )
}

export default MEA
