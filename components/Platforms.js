import axios from 'axios'
import React from 'react'
import { useQuery } from 'react-query'

const fetchPlatforms = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/platforms/lists/parents?key=${process.env.NEXT_PUBLIC_API_KEY}`
  )
  return res.data?.results
}

const Platforms = ({ handlePlatforms, className }) => {
  const platformsQuery = useQuery('platforms', fetchPlatforms, {
    refetchOnWindowFocus: false
  })

  const classNames = `${className} relative`

  return (
    <label className={classNames}>
      <select onChange={handlePlatforms}>
        <option>Platforms</option>
        {platformsQuery.data?.map((platform) => {
          return (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          )
        })}
      </select>
      <svg
        className="w-5 h-5 text-gray-400 absolute top-1/2 right-1 -mt-2.5 pointer-events-none"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        ></path>
      </svg>
    </label>
  )
}

export async function getStaticProps() {
  const queryClientPl = new QueryClient()

  await queryClientPl.prefetchInfiniteQuery('platforms', fetchPlatforms)

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClientPl)))
    }
  }
}

export { Platforms }
