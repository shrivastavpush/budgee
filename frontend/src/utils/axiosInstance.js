import axios from 'axios'
import { BASE_URL } from './apiPaths'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token")
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    //Handle common errors globally
    if (error.response) {
      if (error.response.status === 401) {
        //Redirect to login page
        window.location.href = '/login'
      } else if (error.response.status === 429) {
        // Rate limit error
        const message = error.response.data?.message || 'Too many requests. Please try again later.'
        toast.error(message)
      } else if (error.response.status === 500) {
        toast.error("Server error, Please try again later.")
      }
    } else if (error.code === "ECONNABORATED") {
      toast.error("Request timeout, Please try again.")
    }
    return Promise.reject(error)
  }
)

export default axiosInstance