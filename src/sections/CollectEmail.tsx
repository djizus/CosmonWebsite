import { useEffect, useState } from 'react'
import Button from '../components/Button/Button'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import { toast } from 'react-toastify'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { isValidEmail } from '@utils/form'
import { useWalletStore } from '@store/walletStore'

type SubscribeProps = {}

const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL

const EMAIL_COLLECTED_LOCAL_STORAGE_KEY = 'email-collected'

export default function CollectEmail({}: SubscribeProps) {
  const { address } = useWalletStore()
  const { setItem, getItem, isKeyInLocalStorage } = useLocalStorage(
    EMAIL_COLLECTED_LOCAL_STORAGE_KEY
  )
  const [email, set_email] = useState('')
  const [subscribeStatus, set_subscribeStatus] = useState('')
  const [subscribeMessage, set_subscribeMessage] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (subscribeMessage) {
      if (subscribeStatus === 'sending') {
        toast.loading('Subscribing', {})
      } else if (subscribeStatus === 'error') {
        toast.error(subscribeMessage.replace('0 -', ''))
      } else if (subscribeStatus === 'success') {
        toast.success(subscribeMessage.replace('0 -', ''))
      }
    }
  }, [subscribeMessage])

  return (
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
        return isKeyInLocalStorage || getItem(EMAIL_COLLECTED_LOCAL_STORAGE_KEY) ? (
          <span className="font-normal">Thank you for subscribing</span>
        ) : (
          <div className="">
            <div className="w-full items-center gap-x-[10px] lg:flex lg:justify-between">
              <input
                onChange={(e) => set_email(e.target.value)}
                value={email}
                type="text"
                className="w-full rounded-2xl border border-[#413673] bg-[#0D0531] py-[18px] pl-6 font-normal"
                placeholder="Enter your email address"
              />

              <div className="pt-6 lg:pt-0">
                <Button
                  onClick={() => {
                    if (email) {
                      if (isValidEmail(email)) {
                        const emailSplit = email.split('@')
                        subscribe({ EMAIL: `${emailSplit[0]}-[${address}]@${emailSplit[1]}` })
                        setItem(EMAIL_COLLECTED_LOCAL_STORAGE_KEY, email)
                      } else {
                        setFormError('Wrong format')
                      }
                    }
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
            {formError ? (
              <div className="mt-[10px]">
                <span className="font-normal text-[#ff0000]">{formError}</span>
              </div>
            ) : null}
          </div>
        )
      }}
    />
  )
}
