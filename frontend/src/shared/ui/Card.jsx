import React from 'react'

const Card = ({ children, className, ...props }) => {
  return (
    <div className={`card p-4.5 md:p-6 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}

export default Card
