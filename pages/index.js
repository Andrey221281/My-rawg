import * as React from 'react'
import { QueryClient, useInfiniteQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import axios from 'axios'
import { DebounceInput } from 'react-debounce-input'

import useIntersectionObserver from '../hooks/useIntersectionObserver'
import { Games, Order, Platforms, Spinner } from '../components'

const fetchGames = async ({ queryKey, pageParam }) => {
  const res = await axios.get(
    pageParam
      ? pageParam
      : `${process.env.NEXT_PUBLIC_BASE_URL}/games?key=${process.env.NEXT_PUBLIC_API_KEY}`,
    {
      params: {
        ...queryKey[1]
      }
    }
  )
  return res.data
}

function Home() {
  const [search, setSearch] = React.useState()
  const [ordering, setOrdering] = React.useState('-relevance')
  const [parent_platforms, setParent_platforms] = React.useState()

  // Query
  const gamesQuery = useInfiniteQuery(
    ['games', { search, ordering, parent_platforms }],
    fetchGames,
    {
      getNextPageParam: (lastPage) => lastPage.next ?? undefined,
      refetchOnWindowFocus: false
    }
  )
  // Observer
  const loadMoreButtonRef = React.useRef()
  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: gamesQuery.fetchNextPage,
    enabled: gamesQuery.hasNextPage
  })

  return (
    <div className="container mx-auto px-5">
      <header className="py-5">
        <DebounceInput
          className="w-full block"
          placeholder="Search..."
          debounceTimeout={1000}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
        <div className="flex flex-wrap mt-5 items-center">
          <Order
            handleOrdering={(e) => {
              setOrdering(e.target.value)
            }}
          />
          <Platforms
            className="ml-0 sm:ml-2 mt-3 sm:mt-0"
            handlePlatforms={(e) => {
              setParent_platforms(e.target.value)
            }}
          />
          {gamesQuery.isFetching && (
            <div className="absolute top-7 right-14">
              <Spinner />
            </div>
          )}
        </div>
      </header>
      <main>
        <div className="grid gap-x-5  grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {gamesQuery?.data?.pages.map((page, index) => {
            if (page.count === 0) return <div>Nothing not found... </div>
            return (
              <React.Fragment key={index}>
                {page.results
                  .filter((result) => result.background_image ?? undefined)
                  .map((result) => (
                    <Games
                      key={result.id}
                      {...result}
                      isFeching={gamesQuery.isFetching}
                    />
                  ))}
              </React.Fragment>
            )
          })}
        </div>

        <button
          className="mt-5"
          style={!gamesQuery.hasNextPage ? { display: 'none' } : {}}
          disabled={!gamesQuery.hasNextPage || gamesQuery.hasNextPage}
          onClick={() => gamesQuery.fetchNextPage()}
          ref={loadMoreButtonRef}
          disabled={!gamesQuery.hasNextPage}
        >
          {gamesQuery.isFetchingNextPage ? (
            <Spinner />
          ) : gamesQuery.hasNextPage ? (
            'Load More'
          ) : (
            'Nothing more to load'
          )}
        </button>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery('games', fetchGames, {
    getNextPageParam: (lastPage) => lastPage.next ?? undefined
  })

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
    }
  }
}

export default Home
