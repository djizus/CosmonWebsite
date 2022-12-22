import Layout from '@components/Layout/Layout'
import Marketplace from '@containers/marketplace'
import { IS_MARKETPLACE_ACTIVE } from '@utils/constants'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    if (!IS_MARKETPLACE_ACTIVE) {
      router.replace('/')
    }
  }, [])

  if (!IS_MARKETPLACE_ACTIVE) {
    return null
  }

  return <Marketplace />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
