import { useEffect, useState } from 'react'
import Button from '../components/Button/Button'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import { toast } from 'react-toastify'
import { useWalletStore } from '../store/walletStore'

export default function Subscribe() {
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
    <div>
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
            <h2 className="mx-auto max-w-[448px]">
              Thank you for subscribing!
            </h2>
          ) : (
            <>
              <h2 className="mx-auto max-w-[448px]">
                Don't miss a drop ever again!
              </h2>
              <div className="items-center gap-x-[10px] lg:flex lg:justify-center lg:pt-[60px]">
                <div className="pt-[60px] lg:w-[468px] lg:pt-0">
                  <input
                    onChange={(e) => set_email(e.target.value)}
                    value={email}
                    type="text"
                    className="primary-text"
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="pt-6 lg:pt-0">
                  <Button
                    onClick={() => {
                      subscribe({ EMAIL: email })
                    }}
                    icon={{
                      direction: 'right',
                      position: 'right',
                    }}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}
