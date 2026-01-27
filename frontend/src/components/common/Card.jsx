import React from 'react'

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-white p-4.5 md:p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
