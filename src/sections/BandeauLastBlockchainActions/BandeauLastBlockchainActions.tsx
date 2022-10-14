import { useWalletStore } from '@store/walletStore'
import clsx from 'clsx'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { CustomIndexedTx } from 'types/IndexedTxMethodType'
import styles from './BandeauLastBlockchainActions.module.scss'
import GreenSword from '@public/icons/green-sword.svg'
import PurpleParachute from '@public/icons/purple-parachute.svg'
import RedBandage from '@public/icons/red-bandage.svg'
import WhiteCards from '@public/icons/white-cards.svg'
import YellowGift from '@public/icons/yellow-gift.svg'
import LastWin from './LastWin'
import LastMintCreated from './LastMintCreated'
import LastClaimRewards from './LastClaimRewards'
import LastLost from './LastLost'
import LastClaimAirdrop from './LastClaimAirdrop'
import { motion } from 'framer-motion'
import LoadingIcon from '@components/LoadingIcon/LoadingIcon'

interface BandeauLastBlockchainActionsProps {}

export type CustomIndexedTxWithDisplayData = CustomIndexedTx & { icon: ReactNode }

const BandeauLastBlockchainActions: React.FC<BandeauLastBlockchainActionsProps> = ({}) => {
  const { searchTx } = useWalletStore()
  const [loading, setLoading] = useState(false)

  const [sliderTotalWidth, setSliderTotalWidth] = useState(0)
  const [slides, setSlides] = useState<ReactNode[]>([])

  useEffect(() => {
    fetchLastBlockchainActions()
  }, [])

  const fetchLastBlockchainActions = () => {
    setLoading(true)
    Promise.all([
      searchTx('fight'),
      searchTx('try_buy'),
      searchTx('claim_rewards'),
      searchTx('claim'),
    ]).then((res) => {
      const win = {
        ...res[0],
        icon: <GreenSword />,
      }
      const lost = {
        ...res[0],
        icon: <RedBandage />,
      }
      const mintedCard = {
        ...res[1],
        icon: <WhiteCards />,
      }
      const claimRewards = {
        ...res[2],
        icon: <YellowGift />,
      }
      const claimAirdrop = {
        ...res[3],
        icon: <PurpleParachute />,
      }

      setSlides([
        <LastWin key={0} tx={win} />,
        <LastClaimRewards key={1} tx={claimRewards} />,
        <LastMintCreated key={2} tx={mintedCard} />,
        <LastLost key={3} tx={lost} />,
        <LastClaimAirdrop key={4} tx={claimAirdrop} />,
        <LastWin key={6} tx={win} />,
        <LastClaimRewards key={7} tx={claimRewards} />,
        <LastMintCreated key={8} tx={mintedCard} />,
        <LastLost key={9} tx={lost} />,
        <LastClaimAirdrop key={10} tx={claimAirdrop} />,
      ])

      setLoading(false)
    })
  }

  const init = useCallback((node) => {
    if (!node) return
    let w = 0
    const nbChild = node.childNodes.length || 0
    node.childNodes.forEach((node: any) => {
      if (node.clientWidth) {
        w = w + node.clientWidth
      }
    })
    // 40 is the gap between each child
    setSliderTotalWidth(w + nbChild * 40)
  }, [])

  return (
    <div
      className={clsx(styles.bandeauLastBlockchainActionsContainer, {
        [styles.isLoading]: loading,
      })}
    >
      {!loading && slides.length ? (
        <div className="max-w-auto relative flex w-full items-center overflow-hidden py-8">
          <div
            style={{
              position: 'absolute',
              width: 0.5,
              height: '80%',
              left: 0,
              background: '#20164F',
              boxShadow: '0 0 8px 3px #20164F',
            }}
          />
          <motion.div
            ref={init}
            className="flex w-full items-center gap-[40px]"
            animate={{ x: [0, -(sliderTotalWidth / 2)] }}
            transition={{ times: [0, 1], duration: 30, ease: 'linear', repeat: Infinity }}
          >
            {slides?.map((s) => s)}
          </motion.div>
          <div
            style={{
              position: 'absolute',
              width: 0.5,
              height: '80%',
              right: 0,
              background: '#20164F',
              boxShadow: '0 0 8px 3px #20164F',
            }}
          />
        </div>
      ) : (
        <div className="py-[60px]">
          <LoadingIcon />
        </div>
      )}
    </div>
  )
}

export default BandeauLastBlockchainActions
