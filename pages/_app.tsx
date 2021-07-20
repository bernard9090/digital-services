import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ToastProvider} from "react-toast-notifications";
import React from 'react';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider autoDismissTimeout={3000}>
    <Component {...pageProps} />
</ToastProvider>
  )
}
export default MyApp
