import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { validateEmail } from '../../utils/helper'

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState(null)

    const handleSignup = async (e) => {
        e.preventDefault()

        let profileImageUrl = ""

        if (!fullName) {
            setError("Please enter your name")
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        if (!password) {
            setError("Please enter the password")
            return
        }

        setError("")

        // Signup API Call
    }

    return (
        <AuthLayout>
            <div className='lg:w-[100%] h-auto md:h-full md:mt-0 flex flex-col justify-center'>
                <h3 className='text-xl font-semibold text-black'>Create an account</h3>
                <p className='text-sx text-slate-700 mt-[5px] mb-6'>Join us today by entering your details</p>

                <form action="" onSubmit={handleSignup}>
                    <ProfilePhotoSelector
                        image={profilePic}
                        setImage={setProfilePic} />

                    <div className="grid grid-cols-3 md:grid-cols-2 gap-4">
                        <Input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label="Full Name"
                            placeholder="Enter your name"
                            type="text" />

                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email Address"
                            placeholder="email@example.com"
                            type="text" />

                        <div className="col-span-2">
                            <Input
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                label="Password"
                                placeholder="Min 8 Characters"
                                type="password" />
                        </div>
                    </div>

                    {error &&
                        <p className='text-red-500 text-xs pb-2.5'>{error}</p>
                    }

                    <button type='submit' className='btn-primary'>SIGN UP</button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Already have an account ? {''}
                        <Link
                            className='font-medium text-primary underline' to='/login'
                        >Login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default SignUp