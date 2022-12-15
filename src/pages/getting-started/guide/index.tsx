import Layout from '@components/Layout/Layout'
import GettingStartedGuide from '@containers/getting-started/guide'
import React, { ReactElement } from 'react'

export default function Page() {
  return <GettingStartedGuide />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
