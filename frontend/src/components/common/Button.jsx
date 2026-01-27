import React from 'react'
import { LuLoader } from '../../utils/icons'

const Button = ({ children, isLoading, className, variant = "primary", disabled, ...props }) => {
  // Base classes suitable for most buttons
  const baseClasses = "w-full text-sm font-medium p-[10px] cursor-pointer rounded-md my-1 flex items-center justify-center gap-2 transition-colors duration-200"

  // Variants
  const variants = {
    primary: "text-white bg-teal-400 shadow-lg shadow-yellow-600/5 hover:bg-teal-500/30 hover:text-teal-600",
    secondary: "text-gray-700 bg-gray-100 hover:bg-gray-200",
    danger: "text-white bg-red-500 hover:bg-red-600",
    outline: "border border-teal-400 text-teal-400 hover:bg-teal-50"
  }

  const disabledClasses = "opacity-70 cursor-not-allowed"

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.primary} ${disabled || isLoading ? disabledClasses : ''} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LuLoader className="animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
