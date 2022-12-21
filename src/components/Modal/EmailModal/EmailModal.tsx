import Button from '@components/Button/Button'
import InputText from '@components/Input/InputText'
import { useLocalStorage } from '@hooks/useLocalStorage'
import {
  EMAIL_COLLECTED_LOCAL_STORAGE_KEY,
  EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY,
} from '@utils/constants'
import { isValidEmail } from '@utils/form'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import * as style from './EmailModal.module.scss'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import { useWalletStore } from '@store/walletStore'
import { toast } from 'react-toastify'

interface Props {
  handleCloseModal: () => void
}

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL

const EmailModal: React.FC<Props> = ({ handleCloseModal }) => {
  const { address } = useWalletStore()
  const { getItem, setItem } = useLocalStorage()

  const [email, setEmail] = useState<string | null>(null)
  const [subscribeStatus, set_subscribeStatus] = useState('')
  const [subscribeMessage, set_subscribeMessage] = useState('')

  const handleSubmitLater = () => {
    const newCount = parseInt(getItem(EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY) ?? '0') + 1

    setItem(EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY, newCount.toString())
    handleCloseModal()
  }

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
    <motion.div
      onClick={(e) => {
        e.stopPropagation()
      }}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={style.overlay}
    >
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

          return (
            <div onClick={(e) => e.stopPropagation()} className={clsx(style.modal)}>
              <div className={clsx(style.modalContent)}>
                <p className={style.modalTitle}>Stay tuned!</p>
                <InputText
                  placeholder="Enter your email address"
                  value={email ?? ''}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className={style.textInput}
                />
                <p className={style.description}>
                  Cosmon will push you game updates. Your email
                  <br />
                  will be associated with your wallet address.
                </p>
                <div className={style.submitContainer}>
                  <Button
                    className={style.laterButton}
                    onClick={handleSubmitLater}
                    type="secondary"
                  >
                    Later
                  </Button>
                  <Button
                    onClick={() => {
                      if (email) {
                        if (isValidEmail(email)) {
                          const emailSplit = email.split('@')
                          subscribe({ EMAIL: `${emailSplit[0]}_${address}_@${emailSplit[1]}` })
                          setItem(EMAIL_COLLECTED_LOCAL_STORAGE_KEY, email)
                          handleCloseModal()
                        }
                      }
                    }}
                    disabled={!isValidEmail(email ?? '')}
                    className={style.submitButton}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )
        }}
      />
    </motion.div>
  )
}

EmailModal.displayName = 'EmailModal'

export default EmailModal
