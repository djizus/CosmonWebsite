import Layout from '@components/Layout/Layout'
import ListedCosmonDetails from '@containers/listedCosmonDetails'
import { useWalletStore } from '@store/walletStore'
import React, { ReactElement, useEffect } from 'react'

export default function Page({}) {
  const { fetchKiInfo, kiInfo } = useWalletStore()

  useEffect(() => {
    fetchKiInfo()
  }, [])

  return <ListedCosmonDetails kiData={kiInfo} />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
