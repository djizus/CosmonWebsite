import style from './Footer.module.scss'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <h1 className="text-left text-3xl font-bold leading-[48px] text-[#FCFCFC]">
          Cosmon
        </h1>
        <div className="flex gap-x-14 pt-8 lg:pt-2">
          <div className="flex ">
            <div className={style['link-group']}>
              <div className={style.title}>About</div>
              <Link href={'/about'}>
                <a className={style.link}>Buy Cosmon</a>
              </Link>
              <Link href={'/about'}>
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
            <Link href={'/about'}>
              <a className={style.link}>Light Paper</a>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex gap-x-9 pt-14 lg:pt-0">
        <Link href="instagram">
          <a href="">
            <img src="/socials/instagram.svg" alt="" />
          </a>
        </Link>
        <Link href="instagram">
          <a href="">
            <img src="/socials/twitter.svg" alt="" />
          </a>
        </Link>

        <Link href="instagram">
          <a href="">
            <img src="/socials/discord.svg" alt="" />
          </a>
        </Link>

        <Link href="instagram">
          <a href="">
            <img src="/socials/medium.svg" alt="" />
          </a>
        </Link>
      </div>

      <div className="pt-[42px] text-left lg:pt-28 lg:text-center">
        Created on 🌍 &nbsp; by the Cosmon DAO
      </div>
    </footer>
  )
}
