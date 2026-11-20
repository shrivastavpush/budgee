import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from '../utils/icons'

const Input = ({ value, label, onChange, placeholder, type, step, min }) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex flex-col">
      <label className="mb-1 text-[13px] font-semibold text-[var(--text-secondary)]">
        {label}
      </label>

      <div className="input-box">
        <input
          className="w-full bg-transparent text-[var(--text-primary)] outline-none"
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          step={step}
          min={min}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
        />

        {type === 'password' && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="cursor-pointer text-[var(--accent)]"
                role="button"
                aria-label="Show password"
                tabIndex={0}
                onClick={() => togglePassword()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    togglePassword()
                  }
                }}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="cursor-pointer text-[var(--text-subtle)]"
                role="button"
                aria-label="Hide password"
                tabIndex={0}
                onClick={() => togglePassword()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    togglePassword()
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Input
