import { useState, useCallback } from 'react'
import axiosInstance from '../../../shared/utils/axiosInstance'
import { API_PATHS } from '../../../shared/utils/apiPaths'
import toast from 'react-hot-toast'

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      )
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    dashboardData,
    loading,
    fetchDashboardData,
  }
}
