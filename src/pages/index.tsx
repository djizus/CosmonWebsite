import { ReactElement, useEffect, useMemo, useState } from 'react'
import ChooseYourLeaders from '../sections/ChooseYourLeaders'
import Hero from '../sections/Hero'
import HoldAndEarn from '../sections/HoldAndEarn'
import Intro from '../sections/Intro'
import RarityLevels from '../sections/RarityLevels'
import Layout from '../components/Layout/Layout'
import Treasury from '../sections/Treasury'
import Roadmap from '../sections/Roadmap'
import Partners from '../sections/Partners'
import CommonQuestions from '../sections/CommonQuestions'
import Subscribe from '../sections/Subscribe'
import Section from '../components/Section/Section'
import BandeauLastBlockchainActions from '@sections/BandeauLastBlockchainActions/BandeauLastBlockchainActions'
import CashPrize from '@components/Highlighted/CashPrize'
import HighlightedCountdown from '@components/Highlighted/Countdown'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { useGameStore } from '@store/gameStore'
import { useArenaStore } from '@store/arenaStore'
import { AnimatePresence, motion } from 'framer-motion'
import {
  EMAIL_COLLECTED_LOCAL_STORAGE_KEY,
  EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY,
} from '@utils/constants'
import { useMount } from 'react-use'
import EmailModal from '@components/Modal/EmailModal/EmailModal'
import { useWalletStore } from '@store/walletStore'
import useIsMobileScreen from '@hooks/useIsMobile'

export default function Page() {
  const { fetchArenasList, arenasList } = useGameStore()
  const { getPrizePool, prizePool } = useArenaStore()
  const { getItem } = useLocalStorage()
  const { isConnected } = useWalletStore()
  const isMobile = useIsMobileScreen()
  const [displayEmailModal, setDisplayEmailModal] = useState(false)

  useEffect(() => {
    if (
      !getItem(EMAIL_COLLECTED_LOCAL_STORAGE_KEY) &&
      parseInt(getItem(EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY) ?? '0') < 3 &&
      isConnected &&
      !isMobile
    ) {
      setDisplayEmailModal(false)
    } else if (isMobile) {
      setDisplayEmailModal(false)
    }
  }, [isConnected, isMobile])

  useMount(() => {
    fetchData()
  })

  const fetchData = async () => {
    if (arenasList?.length <= 0) {
      await fetchArenasList()
    }
  }

  const leaguePro = useMemo(() => {
    if (arenasList?.length > 0) {
      return arenasList.filter((a) => a.name !== 'Training')[0]
    }
    return undefined
  }, [arenasList])

  useEffect(() => {
    if (leaguePro) {
      fetchLeagueProPrizePool(leaguePro.contract)
    }
  }, [leaguePro])

  const fetchLeagueProPrizePool = (leagueProContractAddress: string) => {
    try {
      getPrizePool(leagueProContractAddress)
    } catch (error) {}
  }

  return (
    <div className="bg-[#09082D]">
      <Section className="bg-cosmon-blue-darker">
        <Hero>
          The first play to earn in the COSMOS ecosystem combining video games, NFT and financial
          gain. Now, let's go to war!{' '}
        </Hero>
      </Section>

      <div className="pt-[50px] lg:pt-[110px]">
        {prizePool ? (
          <div className="mb-[68px] flex flex-col justify-center gap-[5%] lg:flex-row ">
            <div className="flex flex-col items-center">
              <p className="mb-[20px] text-[22px] font-semibold text-white">Current Prize Pool</p>
              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CashPrize prize={prizePool} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-[32px] flex flex-col items-center lg:mt-[0px]">
              <p className="mb-[20px] text-[22px] font-semibold text-white ">League ends in</p>
              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <HighlightedCountdown />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : null}
      </div>

      <Section className="bg-cosmon-blue-darker pt-[91px] lg:pt-[185px] lg:pb-[180px]">
        <Intro />
      </Section>

      <Section className="overflow-hidden pt-[165px] pb-[76px] lg:pt-[272px] lg:pb-[138px]">
        <RarityLevels />
      </Section>

      <Section className="overflow-hidden pt-[159px] lg:pt-[172px]">
        <HoldAndEarn />
      </Section>

      <Section className="overflow-hidden pt-[168px]">
        <Treasury />
      </Section>

      <Section className="overflow-hidden pt-44">
        <Roadmap />
      </Section>

      <Section className="pt-[86px] lg:pt-[240px]">
        <Partners />
      </Section>

    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
