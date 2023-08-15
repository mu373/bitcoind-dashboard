import type { AppProps } from 'next/app'
import '../styles/style.scss'
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
