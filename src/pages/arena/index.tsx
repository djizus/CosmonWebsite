import Layout from '@components/Layout/Layout'
import Arena from '@containers/arena'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import { useMount } from 'react-use'
import {
  EMAIL_COLLECTED_LOCAL_STORAGE_KEY,
  EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY,
} from '@utils/constants'
import EmailModal from '@components/Modal/EmailModal/EmailModal'

const ARENA_IS_ACTIVE = Boolean(process.env.NEXT_PUBLIC_ARENA_IS_ACTIVE)

export default function Page() {
  const router = useRouter()
  const { getItem } = useLocalStorage()

  const [displayEmailModal, setDisplayEmailModal] = useState(false)

  useEffect(() => {
    if (
      !getItem(EMAIL_COLLECTED_LOCAL_STORAGE_KEY) &&
      parseInt(getItem(EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY) ?? '0') < 5
    ) {
      setDisplayEmailModal(true)
    }
  }, [])

  useMount(() => {
    if (!ARENA_IS_ACTIVE) {
      router.push(`/`)
    }
  })

  return ARENA_IS_ACTIVE ? (
    <>
      {displayEmailModal ? (
        <EmailModal handleCloseModal={() => setDisplayEmailModal(false)} />
      ) : null}
      <Arena />
    </>
  ) : null
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
