import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button/Button'
import Footer from '../Footer/Footer'
import HamburgerMenu from '../HamburgerMenu/hamburgerMenu'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col">
      <Head>
        <title>Cosmon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="absolute z-10 flex w-full items-center justify-between px-5 pt-5">
        <div className="flex">
          <div className="relative h-[22px] w-[73px] lg:h-[40px] lg:w-[131px]">
            <Image priority={true} src={'/logo.png'} layout="fill" />
          </div>

          <div className="ml-20 hidden items-center gap-x-[60px] lg:flex">
            <Link href="/about">
              <a>About</a>
            </Link>
            <Link href="/buy cosmon">
              <a>Buy cosmon</a>
            </Link>
            <Link href="/gallery">
              <a>Gallery</a>
            </Link>
          </div>
        </div>

        <div className="lg:hidden">
          <HamburgerMenu />
        </div>

        <div className="hidden items-center lg:flex">
          <Button className="max-h-[42px]" type="secondary">
            Connect wallet
          </Button>
        </div>
      </header>

      <main>{children}</main>
      <Footer />
    </div>
  )
}
