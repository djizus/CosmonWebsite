import { motion } from 'framer-motion'
import React from 'react'
import * as style from './style.module.scss'

interface MEAProps {
  link: string
  imgSrc: string
  linkInfo?: string
}

const MEA: React.FC<MEAProps> = ({ link, imgSrc, linkInfo }) => {
  return (
    <motion.div whileHover={{ scale: 0.99 }} className="relative flex flex-col items-start">
      <a href={link} target={'_blank'}>
        <img
          src={imgSrc}
          style={{
            objectFit: 'contain',
            borderRadius: 16,
            maxHeight: 235,
          }}
        />
        {linkInfo ? (
          <a href={linkInfo} target="_blank">
            <img src="/icons/info.svg" alt="Prizepool info" className={style.infoIcon} />
          </a>
        ) : null}
      </a>
    </motion.div>
  )
}

export default MEA
