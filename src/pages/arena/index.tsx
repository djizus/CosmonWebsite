import Layout from '@components/Layout/Layout'
import Arena from '@containers/arena'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { useMount } from 'react-use'

const ARENA_IS_ACTIVE = Boolean(process.env.NEXT_PUBLIC_ARENA_IS_ACTIVE)

export default function Page() {
  const router = useRouter()

  useMount(() => {
    if (!ARENA_IS_ACTIVE) {
      router.push(`/`)
    }
  })

  return ARENA_IS_ACTIVE ? <Arena /> : null
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
