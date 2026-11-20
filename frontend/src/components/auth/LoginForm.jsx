import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../common/Input'
import Button from '../common/Button'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/UserContextValue'

const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!password) {
      toast.error('Please enter the password')
      return
    }

    setIsLoading(true)
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      })
      const { token, user } = response.data
      if (token) {
        localStorage.setItem('token', token)
        updateUser(user)
        navigate('/dashboard')
        toast.success('Login successful')
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
    <form onSubmit={handleLogin}>
      <div data-auth-item>
        <h3 className="text-2xl font-bold tracking-tight">Welcome back</h3>
        <p className="mt-1 mb-6 text-sm text-[var(--text-secondary)]">
          Sign in to pick up where you left off.
        </p>
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
      <div data-auth-item>
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
        />
      </div>
      <div data-auth-item>
        <Button type="submit" isLoading={isLoading}>
          Sign in
        </Button>
      </div>
      <p
        data-auth-item
        className="mt-4 text-center text-[13px] text-[var(--text-secondary)]"
      >
        New to Budgee?{' '}
        <button
          type="button"
          className="font-semibold text-[var(--accent)] hover:underline"
          onClick={onSwitch}
        >
          Create an account
        </button>
      </p>
    </form>
  )
}

export default LoginForm
