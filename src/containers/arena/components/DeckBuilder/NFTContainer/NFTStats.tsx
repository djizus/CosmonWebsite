import { motion } from 'framer-motion'
import React from 'react'
import Light from '@public/cosmons/stats/light.svg'
import Shield from '@public/cosmons/stats/shield.svg'
import Sparkles from '@public/cosmons/stats/sparkles.svg'
import Spiral from '@public/cosmons/stats/spiral.svg'
import Sword from '@public/cosmons/stats/sword.svg'
import Zap from '@public/cosmons/stats/zap.svg'
import Heart from '@public/cosmons/stats/heart.svg'
import { getCosmonStat } from '@utils/cosmon'
import { NFTId } from '@services/deck'
import Tooltip from '@components/Tooltip/Tooltip'

interface NFTStatsProps {
  nftStats: any
  nftId: NFTId
}

const dropIn = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const NFTStats: React.FC<NFTStatsProps> = ({ nftStats, nftId }) => {
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        height: '100%',
        background: '#f6f6fc',
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderLeft: '1px solid #e7e7ea',
      }}
    >
      <div className="grid grid-cols-2 grid-rows-3 gap-[17px] gap-x-[9px]">
        <div className="flex items-center justify-center">
          <Sword data-tip="tootlip" data-for={`${nftId}-stat-atq`} />
          <Tooltip id={`${nftId}-stat-atq`}>
            <p>Attack</p>
          </Tooltip>
          <p className="ml-[5px] text-sm font-semibold text-cosmon-main-secondary">
            {getCosmonStat(nftStats, 'Atq')?.value}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Heart data-tip="tootlip" data-for={`${nftId}-stat-hp`} />
          <Tooltip id={`${nftId}-stat-hp`}>
            <p>Health Points</p>
          </Tooltip>
          <p className="ml-[5px] text-sm font-semibold text-cosmon-main-secondary">
            {getCosmonStat(nftStats, 'Hp')?.value}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Shield data-tip="tootlip" data-for={`${nftId}-stat-def`} />
          <Tooltip id={`${nftId}-stat-def`}>
            <p>Defense</p>
          </Tooltip>
          <p className="ml-[5px] text-sm font-semibold text-cosmon-main-secondary">
            {getCosmonStat(nftStats, 'Def')?.value}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Zap data-tip="tootlip" data-for={`${nftId}-stat-spe`} />
          <Tooltip id={`${nftId}-stat-spe`}>
            <p>Speed</p>
          </Tooltip>
          <p className="ml-[5px] text-sm font-semibold text-cosmon-main-secondary">
            {getCosmonStat(nftStats, 'Spe')?.value}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Sparkles data-tip="tootlip" data-for={`${nftId}-stat-luk`} />
          <Tooltip id={`${nftId}-stat-luk`} place="top" offset={{ bottom: 10 }}>
            <p>Luck</p>
          </Tooltip>
          <p className="ml-[5px] text-sm font-semibold text-cosmon-main-secondary">
            {getCosmonStat(nftStats, 'Luk')?.value}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Light data-tip="tootlip" data-for={`${nftId}-stat-int`} />
          <Tooltip id={`${nftId}-stat-int`} place="top" offset={{ bottom: 10 }}>
            <p>Intelligence</p>
          </Tooltip>
          <p className="ml-[5px] text-sm font-semibold text-cosmon-main-secondary">
            {getCosmonStat(nftStats, 'Int')?.value}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default NFTStats
