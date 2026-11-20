import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/UserContextValue'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email.trim())) {
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
        email: email.trim(),
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
          Welcome back
        </h3>
        <p className="mt-1 mb-6 text-sm text-[var(--text-secondary)]">
          Sign in to pick up where you left off.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="email@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          <Button type="submit" isLoading={isLoading}>
            Sign in
          </Button>

          <p className="mt-4 text-center text-[13px] text-[var(--text-secondary)]">
            New to Budgee?{' '}
            <Link
              className="font-semibold text-[var(--accent)] hover:underline"
              to="/signup"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
