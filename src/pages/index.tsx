import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import HamburgerMenu from '../components/HamburgerMenu/hamburgerMenu'
import HeroSection from '../sections/HeroSection'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col">
      <Head>
        <title>Cosmon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center justify-between px-5 pt-5">
        <Image priority={true} src={'/logo.png'} width={73} height={22} />
        <HamburgerMenu />
      </header>

      <main className="flex flex-col items-center">
        <HeroSection>
          The first play to earn in the COSMOS ecosystem combining video games,
          NFT and financial gain. Now, let's go to war!{' '}
        </HeroSection>
      </main>

      <footer className="flex"></footer>
    </div>
  )
}

export default Home
