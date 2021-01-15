import React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

export const Games = (result) => {
  return (
    <div className="w-full mb-5 inline-block">
      <div className="rounded-lg overflow-hidden border border-gray-800 h-full">
        <div
          className="h-40 bg-center bg-cover bg-gray-900"
          style={{ backgroundImage: `url(${result.background_image})` }}
          role="img"
          aria-label={result.name}
        />
        <div className="p-3 flex justify-between items-center">
          <h1 className="pr-1">
            <Link href={result.slug}>{result.name}</Link>
          </h1>

          <div className="bg-blue-500 inline rounded py-px px-1 ml-3">
            <span>{result.rating}</span>
          </div>
        </div>
        <div className="p-3 flex justify-between items-center flex-auto">
          <div className="">Released:</div>
          <div>{dayjs(result.released).format('DD MMM YYYY')}</div>
        </div>
      </div>
    </div>
  )
}
