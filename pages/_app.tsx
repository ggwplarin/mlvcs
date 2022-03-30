import React from 'react';
import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useUser } from '@lib/hooks'
function MyApp({ Component, pageProps }: AppProps) {
  const Header = dynamic(() => import('@components/Header'))
  const { user, mutate } = useUser()
  return <div>
    <Header user={user}></Header>
    <Component {...pageProps} />
  </div>
}

export default MyApp
