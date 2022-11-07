import Layout from '@components/Layout/Layout'
import MyAssets from '@containers/my-assets'
import React, { ReactElement } from 'react'

export default function Page() {
  return <MyAssets />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
