import 'react-toastify/dist/ReactToastify.min.css'
import '../styles/globals.scss'
import '../styles/toastify.scss'
import Close from '/public/icons/close.svg'

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <>
      <Component {...pageProps} />
      <ToastContainer
        closeButton={
          <div className="-mt-2 flex h-[24px] min-w-[24px] flex-1 cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-10">
            <Close className="h-[16px] w-[16px]" />
          </div>
        }
        theme="dark"
      />
    </>
  )
}
