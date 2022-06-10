import style from './Footer.module.scss'
import Link from 'next/link'
import Button from '../Button/Button'

export default function Footer() {
  return (
    <footer className={`relative ${style.footer} bg-cosmon-blue-dark`}>
      <div className="max-w-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h1 className="text-left text-3xl font-bold leading-[48px] text-[#FCFCFC]">
            Cosmon
          </h1>
          <div className="flex gap-x-14 pt-8  lg:pt-2 ">
            <div className="flex lg:ml-20 lg:mr-[96px]">
              <div className={style['link-group']}>
                <div className={style.title}>About</div>
                <Link href={'/buy-cosmon'}>
                  <a className={style.link}>Buy Cosmon</a>
                </Link>
                <Link href={'/my-assets'}>
                  <a className={style.link}>Gallery</a>
                </Link>
                <Link href={'/about'}>
                  <a className={style.link}>Storyline</a>
                </Link>
              </div>
            </div>

            <div className={style['link-group']}>
              <div className={style.title}>Support</div>
              <Link href={'/about'}>
                <a className={style.link}>Help Center</a>
              </Link>
              <Link
                href={
                  'https://inky-sidewalk-879.notion.site/Cosmon-white-paper-722dc48d832a49e9ae348eaf94184706'
                }
              >
                <a target="_blank" className={style.link}>
                  Light Paper
                </a>
              </Link>
            </div>
          </div>

          <div className="hidden flex-col items-end gap-y-5 lg:flex">
            <input
              className="secondary-text"
              type="text"
              placeholder="Enter your email address"
            />
            <Button size="small">Subscribe</Button>
          </div>
        </div>

        <div className="flex gap-x-9 pt-14 lg:absolute lg:top-40 ">
          <Link href="https://twitter.com/playcosmon">
            <a target="_blank">
              <img src="/socials/twitter.svg" alt="" />
            </a>
          </Link>

          <Link href="https://discord.gg/8szcmpypvt">
            <a target="_blank">
              <img src="/socials/discord.svg" alt="" />
            </a>
          </Link>

          <Link href="https://medium.com/ki-foundation">
            <a target="_blank">
              <img src="/socials/medium.svg" alt="" />
            </a>
          </Link>
        </div>

        <div className="pt-[42px] text-left lg:pt-28 lg:text-center">
          Created on 🌍 &nbsp; by the Cosmon DAO
        </div>
      </div>
    </footer>
  )
}
