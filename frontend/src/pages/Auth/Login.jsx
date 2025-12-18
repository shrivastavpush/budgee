import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInsance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/UserContext'
import toast from 'react-hot-toast'
import { LuLoader } from '../../utils/icons'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      // setError("Please enter a valid email address")
      toast.error("Please enter a valid email address")
      return
    }

    if (!password) {
      // setError("Please enter the password")
      toast.error("Please enter the password")
      return
    }

    setError("")
    setIsLoading(true)

    // Login API Call
    try {
      const response = await axiosInsance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })

      const { token, user } = response.data

      if (token) {
        localStorage.setItem("token", token)
        updateUser(user)
        navigate('/dashboard')
        toast.success("Login successful")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        // setError(error.response.data.message)
        toast.error(error.response.data.message)
      } else {
        // setError("Something went wrong. Please try again.")
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-sx text-slate-700 mt-[5px] mb-6'>Login to your account to continue</p>

        <form action="" onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="email@example.com"
            type="text" />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password" />

          {error &&
            <p className='text-red-500 text-xs pb-2.5'>{error}</p>
          }

          <button
            type='submit'
            className='btn-primary flex items-center justify-center gap-2'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LuLoader className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              'LOGIN'
            )}
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account ? {''}
            <Link
              className='font-medium text-teal-400 underline' to='/signup'
            >SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login