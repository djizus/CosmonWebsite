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
import Countdown from '@components/Highlighted/Countdown'
import { useMount } from 'react-use'
import { useGameStore } from '@store/gameStore'
import { differenceInMilliseconds } from 'date-fns'
import { useArenaStore } from '@store/arenaStore'
import { Coin } from '@cosmjs/proto-signing'
import { AnimatePresence, motion } from 'framer-motion'

export default function Page() {
  const { fetchArenasList, arenasList } = useGameStore()
  const { fetchNextPrizePool } = useArenaStore()
  const [prize, setPrize] = useState<Coin>()

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

  const leagueStartDate = useMemo(() => {
    if (leaguePro) {
      const startTimestamp = leaguePro.arena_open_time
      const startEpoch = new Date(0)
      startEpoch.setUTCSeconds(startTimestamp)
      return differenceInMilliseconds(startEpoch, new Date())
    }
  }, [leaguePro])

  useEffect(() => {
    if (leaguePro) {
      fetchLeagueProPrizePool(leaguePro.contract)
    }
  }, [leaguePro])

  const fetchLeagueProPrizePool = async (leagueProContractAddress: string) => {
    try {
      const prize = await fetchNextPrizePool(leagueProContractAddress)
      setPrize(prize[0])
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
        {prize && leagueStartDate ? (
          <div className="mb-[68px] flex flex-col justify-center gap-[5%] lg:flex-row ">
            <div className="flex flex-col items-center">
              <p className="mb-[20px] text-[22px] font-semibold text-white">First Prize Pool</p>
              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CashPrize prize={prize} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-[32px] flex flex-col items-center lg:mt-[0px]">
              <p className="mb-[20px] text-[22px] font-semibold text-white ">
                Professional Leagues are coming
              </p>
              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Countdown from={leagueStartDate} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : null}
        <BandeauLastBlockchainActions />
      </div>

      <Section className="bg-cosmon-blue-darker pt-[91px] lg:pt-[185px] lg:pb-[180px]">
        <Intro />
      </Section>

      <Section className="-mt-3 mb-[160px] pb-[360px] pt-80 lg:mb-0 lg:min-h-[1500px] lg:pt-36">
        <ChooseYourLeaders />
      </Section>

      <Section className="pt-[165px] pb-[76px] lg:pt-[272px] lg:pb-[138px]">
        <RarityLevels />
      </Section>

      <Section className=" pt-[159px] lg:pt-[172px]">
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

      <Section className="pt-52 lg:pt-[261px]">
        <CommonQuestions />
      </Section>

      <Section className="pt-48 pb-28 lg:pt-[298px]">
        <Subscribe />
      </Section>
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
