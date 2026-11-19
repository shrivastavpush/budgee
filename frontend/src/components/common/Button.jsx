import React from 'react'
import { LuLoader } from '../../utils/icons'

const Button = ({
  children,
  isLoading,
  className,
  variant = 'primary',
  disabled,
  ...props
}) => {
  const baseClasses =
    'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200'

  const variants = {
    primary: 'app-primary-button',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-teal-400 text-teal-600 hover:bg-teal-50',
  }

  const disabledClasses = 'opacity-70 cursor-not-allowed'

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
