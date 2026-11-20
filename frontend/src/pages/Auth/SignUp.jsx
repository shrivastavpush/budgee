import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/UserContextValue'
import uploadImage from '../../utils/uploadImage'
import toast from 'react-hot-toast'
import { LuLoader } from '../../utils/icons'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!fullName) {
      toast.error('Please enter your name')
      return
    }

    if (!validateEmail(email.trim())) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    // Signup API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email: email.trim(),
        password,
      })

      const { token, user } = response.data
      if (token) {
        localStorage.setItem('token', token)
        let finalUser = user
        // Upload needs auth, so it happens right after registration.
        if (profilePic) {
          try {
            const { imageUrl } = await uploadImage(profilePic)
            finalUser = { ...user, profileImageUrl: imageUrl }
          } catch {
            toast.error('Profile photo upload failed. You can retry later.')
          }
        }
        updateUser(finalUser)
        navigate('/dashboard')
        toast.success('Signup successful')
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Create your account
        </h3>
        <p className="mt-1 mb-5 text-sm text-[var(--text-secondary)]">
          Get a clearer view of your money, starting today.
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Input
              value={fullName}
              onChange={({ target }) => {
                setFullName(target.value)
              }}
              label="Full Name"
              placeholder="Enter your name"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => {
                setEmail(target.value)
              }}
              label="Email Address"
              placeholder="email@example.com"
              type="text"
            />

            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value)
                }}
                label="Password"
                placeholder="Min 8 Characters"
                type="password"
              />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Sign up
          </Button>

          <p className="mt-4 text-center text-[13px] text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link
              className="font-semibold text-[var(--accent)] hover:underline"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
