import Layout from '@components/Layout/Layout'
import Marketplace from '@containers/marketplace'
import React, { ReactElement } from 'react'

export default function Page() {
  return <Marketplace />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
