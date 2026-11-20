import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../../../shared/ui/Input'
import Button from '../../../shared/ui/Button'
import ProfilePhotoSelector from './ProfilePhotoSelector'
import { validateEmail } from '../../../shared/utils/helper'
import axiosInstance from '../../../shared/utils/axiosInstance'
import { API_PATHS } from '../../../shared/utils/apiPaths'
import { UserContext } from '../context/UserContextValue'
import uploadImage from '../../../shared/utils/uploadImage'

const SignUpForm = ({ onSwitch }) => {
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
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
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
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <div data-auth-item>
        <h3 className="text-2xl font-bold tracking-tight">
          Create your account
        </h3>
        <p className="mt-1 mb-5 text-sm text-[var(--text-secondary)]">
          Get a clearer view of your money, starting today.
        </p>
      </div>
      <div data-auth-item>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
      </div>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <div data-auth-item>
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Enter your name"
            type="text"
          />
        </div>
        <div data-auth-item>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="email@example.com"
            type="email"
          />
        </div>
        <div data-auth-item className="sm:col-span-2">
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
        </div>
      </div>
      <div data-auth-item>
        <Button type="submit" isLoading={isLoading}>
          Sign up
        </Button>
      </div>
      <p
        data-auth-item
        className="mt-4 text-center text-[13px] text-[var(--text-secondary)]"
      >
        Already have an account?{' '}
        <button
          type="button"
          className="font-semibold text-[var(--accent)] hover:underline"
          onClick={onSwitch}
        >
          Sign in
        </button>
      </p>
    </form>
  )
}

export default SignUpForm
