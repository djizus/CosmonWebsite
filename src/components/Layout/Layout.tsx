import Head from 'next/head'
import Image from 'next/image'
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
        <Image priority={true} src={'/logo.png'} width={73} height={22} />
        <HamburgerMenu />
      </header>

      <main>{children}</main>
      <Footer />
    </div>
  )
}
