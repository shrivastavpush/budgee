import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({ value, label, onChange, placeholder, type }) => {

    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className='flex flex-col'>
            <label className='text-[13px] text-slate-800'>{label}</label>

            <div className='input-box'>
                <input
                    className='w-full bg-transparent outline-none'
                    value={value}
                    onChange={(e) => onChange(e)}
                    placeholder={placeholder}
                    type={type === 'password' ? showPassword ? 'text' : 'password' : type}
                />

                {type === 'password' && (
                    <>
                        {showPassword ? (
                            < FaRegEye
                                size={22}
                                className='text-primary cursor-pointer '
                                onClick={() => togglePassword()} />
                        ) : (
                            < FaRegEyeSlash
                                size={22}
                                className='text-slate-400 cursor-pointer '
                                onClick={() => togglePassword()} />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Input
