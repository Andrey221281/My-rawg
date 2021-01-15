import React from 'react'

export const Order = ({ handleOrdering, className }) => {
  const classNames = `${className} relative`

  return (
    <label className={classNames}>
      <select onChange={handleOrdering}>
        <option>Order: Default</option>
        <option value="-rating">rating :highest first</option>
        <option value="rating">rating :lowest first</option>
        <option value="-released">released :highest first</option>
        <option value="released">released :lowest first</option>
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
