import Layout from '@components/Layout/Layout'
import ListedCosmonDetails from '@containers/listedCosmonDetails'
import { GetStaticPaths } from 'next'
import React, { ReactElement } from 'react'
import { KiInformationResponse } from 'types'

interface Props {
  kiData: KiInformationResponse
}

export default function Page({ kiData }: Props) {
  return <ListedCosmonDetails kiData={kiData} />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export async function getStaticProps() {
  const res = await fetch('https://api-osmosis.imperator.co/tokens/v2/XKI', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = (await res.json()) as KiInformationResponse[]

  return {
    props: {
      kiData: data[0],
    },
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  }
}
