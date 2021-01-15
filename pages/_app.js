import ErrorBoundary from '../components/ErrorBoundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import Router from 'next/router'

// import { ReactQueryDevtools } from 'react-query/devtools'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import './styles/globals.css'

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
