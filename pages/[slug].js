import * as React from 'react'
import axios from 'axios'
import { QueryClient, useQuery } from 'react-query'
import { useRouter } from 'next/router'

import { dehydrate } from 'react-query/hydration'
import dayjs from 'dayjs'

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/games`
const apiKey = process.env.NEXT_PUBLIC_API_KEY

const fetchAll = (url) => {
  return async () => {
    const res = await axios.get(`${baseUrl}/${url}?key=${apiKey}`)
    return res.data
  }
}

function Game({ params }) {
  const [active, setActive] = React.useState(0)
  const router = useRouter()
  // Queries
  const gameQuery = useQuery(
    ['game', { slug: params?.slug }],
    fetchAll(params?.slug),
    {
      refetchOnWindowFocus: false
    }
  )

  const screenshotsQuery = useQuery(
    ['screenshot', { slug: params?.slug }],
    fetchAll(`${params?.slug}/screenshots`),
    {
      refetchOnWindowFocus: false
    }
  )

  return (
    <main className="container mx-auto my-5 px-5">
      <div>
        <h1 className="text-3xl mb-5">{gameQuery.data?.name}</h1>
        <div className="block">
          <img
            className="object-cover sm:h-96 xl:h-xxl object-top w-full block rounded-xl"
            src={screenshotsQuery.data.results[active].image}
            alt={gameQuery.data?.name}
          />
        </div>
        <div className="flex justify-center -mx-2 my-5 overflow-x-auto">
          {screenshotsQuery?.data?.results.map((screenshot, i) => (
            <React.Fragment key={screenshot.id}>
              <img
                data-index={i}
                onClick={(e) => {
                  setActive(Number(e.target.dataset.index))
                }}
                className={`${
                  i === active
                    ? 'border-2 border-blue-500 border-opacity-30'
                    : ''
                } h-32 rounded-xl px-2 cursor-pointer focus:border-2 focus:border-red-500`}
                src={screenshot.image}
                alt={gameQuery.data?.name}
              />
            </React.Fragment>
          ))}
        </div>
        <div className="mt-5">
          <p className="leading-relaxed">{gameQuery.data?.description_raw}</p>
          <div className="my-3 flex items-center">
            <span className="text-gray-500">Released:</span>
            <span className="ml-3">
              {dayjs(gameQuery.data?.released).format('DD MMM YYYY')}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Rating:</span>
            <div className="bg-blue-500 inline rounded py-px px-1 ml-3">
              <span>{gameQuery.data?.rating}</span>
            </div>
          </div>
          <div className="my-3 flex items-center">
            <span className="text-gray-500">Website:</span>
            <span className="ml-3">
              <a href={gameQuery.data?.website}>{gameQuery.data?.website}</a>
            </span>
          </div>
        </div>
      </div>

      <a
        onClick={() => router.back()}
        className="btn inline-block mt-5 hover:no-underline cursor-pointer"
      >
        &#8592; Back to the games list
      </a>
    </main>
  )
}

// SSG SSR
export async function getServerSideProps({ params }) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(
    ['game', { slug: params?.slug }],
    fetchAll(params?.slug)
  )

  await queryClient.prefetchQuery(
    ['screenshot', { slug: params?.slug }],
    fetchAll(`${params?.slug}/screenshots`)
  )

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      params
    }
  }
}

export default Game
