import { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContextValue'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../shared/utils/axiosInstance'
import { API_PATHS } from '../../../shared/utils/apiPaths'
import toast from 'react-hot-toast'

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) return

    let isMounted = true

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO)

        if (isMounted && response.data) {
          updateUser(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch user info: ', error)
        if (!isMounted) return
        // Only an auth failure means "logged out". For network/server errors keep
        // the session; redirecting would bounce back here via PublicRoute and loop.
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          clearUser()
          navigate('/login')
        } else {
          toast.error('Could not load your profile. Please refresh.')
        }
      }
    }

    fetchUserInfo()

    return () => {
      isMounted = false
    }
  }, [user, updateUser, clearUser, navigate])
}
