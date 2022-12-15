import Layout from '@components/Layout/Layout'
import GettingStarted from '@containers/getting-started'
import { isMobile } from '@utils/browser'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { useMount } from 'react-use'

export default function Page() {
  const router = useRouter()

  useMount(() => {
    if (isMobile()) {
      router.push(`/`)
    }
  })

  return <GettingStarted />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
