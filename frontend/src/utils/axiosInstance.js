import axios from 'axios'
import { API_PATHS } from './apiPaths'
import { BASE_URL } from './apiPaths'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // send the httpOnly refresh cookie
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Single in-flight refresh shared by all requests that hit a 401 together.
let refreshPromise = null
const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${BASE_URL}${API_PATHS.AUTH.REFRESH}`,
        {},
        { withCredentials: true, timeout: 10000 }
      )
      .then((res) => {
        localStorage.setItem('token', res.data.token)
        return res.data.token
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

const AUTH_URLS = [
  API_PATHS.AUTH.LOGIN,
  API_PATHS.AUTH.REGISTER,
  API_PATHS.AUTH.REFRESH,
  API_PATHS.AUTH.LOGOUT,
]

//Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    //Handle common errors globally
    if (error.response) {
      const original = error.config
      if (error.response.status === 401) {
        const isAuthCall = AUTH_URLS.includes(original?.url)
        // Access token expired: refresh once, then retry the original request.
        if (original && !original._retry && !isAuthCall) {
          original._retry = true
          try {
            const token = await refreshAccessToken()
            original.headers.Authorization = `Bearer ${token}`
            return axiosInstance(original)
          } catch {
            // refresh failed: fall through to logout below
          }
        }
        const path = window.location.pathname
        if (path !== '/login' && path !== '/signup') {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
      } else if (error.response.status === 429) {
        // Rate limit error
        const message =
          error.response.data?.message ||
          'Too many requests. Please try again later.'
        toast.error(message)
      } else if (error.response.status === 500) {
        toast.error('Server error, Please try again later.')
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout, Please try again.')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
