import Layout from '@components/Layout/Layout'
import ListedCosmonDetails from '@containers/listedCosmonDetails'
import { useWalletStore } from '@store/walletStore'
import { IS_MARKETPLACE_ACTIVE } from '@utils/constants'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'

export default function Page({}) {
  const { fetchKiInfo, kiInfo } = useWalletStore()
  const router = useRouter()

  useEffect(() => {
    if (!IS_MARKETPLACE_ACTIVE) {
      router.replace('/')
    } else {
      fetchKiInfo()
    }
  }, [])

  if (!IS_MARKETPLACE_ACTIVE) {
    return null
  }

  return <ListedCosmonDetails kiData={kiInfo} />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
