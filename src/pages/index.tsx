import type { NextPage } from 'next'
import type { ReactElement } from 'react'
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

export default function Page() {
  return (
    <>
      <Section className="bg-cosmon-blue-darker pb-2">
        <Hero>
          The first play to earn in the COSMOS ecosystem combining video games,
          NFT and financial gain. Now, let's go to war!{' '}
        </Hero>
      </Section>

      <Section className="bg-cosmon-blue-darker pt-[91px]">
        <Intro />
      </Section>

      <Section className="-mt-3 mb-[160px] pt-36 pb-[360px]">
        <ChooseYourLeaders />
      </Section>

      <Section className="pt-[165px] pb-[76px]">
        <RarityLevels />
      </Section>

      <Section className=" pt-[159px]">
        <HoldAndEarn />
      </Section>

      <Section className="overflow-hidden pt-[168px]">
        <Treasury />
      </Section>

      <Section className="pt-44">
        <Roadmap />
      </Section>

      <Section className="pt-[86px]">
        <Partners />
      </Section>

      <Section className="pt-52">
        <CommonQuestions />
      </Section>

      <Section className="pt-48">
        <Subscribe />
      </Section>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
