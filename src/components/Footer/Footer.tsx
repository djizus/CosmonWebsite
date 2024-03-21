import * as style from './Footer.module.scss'
import Link from 'next/link'
import Button from '../Button/Button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import { useWalletStore } from '../../store/walletStore'

export default function Footer() {
  const { hasSubscribed, setHasSubscribed } = useWalletStore((state) => state)
  const [email, set_email] = useState('')
  const [subscribeStatus, set_subscribeStatus] = useState('')
  const [subscribeMessage, set_subscribeMessage] = useState('')
  const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL

  useEffect(() => {
    if (subscribeMessage) {
      if (subscribeStatus === 'sending') {
        toast.loading('Subscribing', {})
      } else if (subscribeStatus === 'error') {
        toast.error(subscribeMessage.replace('0 -', ''))
      } else if (subscribeStatus === 'success') {
        toast.success(subscribeMessage.replace('0 -', ''))
        setHasSubscribed(true)
      }
    }
  }, [subscribeMessage])

  return (
    <footer className={`relative ${style.footer} bg-cosmon-blue-dark`}>
      <div className="max-w-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h1 className="text-left text-3xl font-bold leading-[48px] text-[#FCFCFC]">Cosmon</h1>
          <div className="flex gap-x-14 pt-8  lg:pt-2 ">
            <div className="flex lg:ml-20 lg:mr-[96px]">
              <div className={style.linkGroup}>
                <div className={style.title}>About</div>
                <Link href={'/buy-cosmon'}>
                  <a className={`${style.link}`}>Buy Cosmon</a>
                </Link>
                <Link href={'/my-assets'}>
                  <a className={`${style.link} `}>My Assets</a>
                </Link>
                {/* <Link href={'/about'}>
                  <a className={style.link}>Storyline</a>
                </Link> */}
              </div>
            </div>

            <div className={style.linkGroup}>
              <div className={style.title}>Support</div>
              <Link href="https://docs.cosmon.ki/">
                <a target="_blank" className={style.link}>
                  Documentation
                </a>
              </Link>
              <Link href="https://commonwealth.im/dashboard/global">
                <a target="_blank" className={style.link}>
                  Commonwealth
                </a>
              </Link>
            </div>
          </div>

          <MailchimpSubscribe
            url={MAILCHIMP_URL}
            render={(props: any) => {
              const { subscribe, status, message } = props || {}
              if (status) {
                set_subscribeStatus(status)
              }
              if (message) {
                set_subscribeMessage(message)
              }
              return hasSubscribed ? (
                <div>Thank you for subscribing!</div>
              ) : (
                <div className="hidden flex-col items-end gap-y-5 lg:flex">
                  <input
                    className="secondary-text"
                    type="text"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => set_email(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      subscribe({ EMAIL: email })
                    }}
                    size="small"
                  >
                    Subscribe
                  </Button>
                </div>
              )
            }}
          />
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
          Created on <span className="px-[2px]"> 🌍 </span> by the Cosmon DAO
        </div>
      </div>
    </footer>
  )
}
