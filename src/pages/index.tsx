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
    <div className="bg-[#09082D]">
      <Section className="bg-cosmon-blue-darker pb-2 lg:pb-32">
        <Hero>
          The first play to earn in the COSMOS ecosystem combining video games,
          NFT and financial gain. Now, let's go to war!{' '}
        </Hero>
      </Section>

      <Section className="bg-cosmon-blue-darker pt-[91px] lg:pt-[60px] lg:pb-[180px]">
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
