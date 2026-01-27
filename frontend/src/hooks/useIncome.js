import { useState, useCallback } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { downloadFile } from '../utils/downloadUtils'
import toast from 'react-hot-toast'

export const useIncome = () => {
  const [incomeData, setIncomeData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchIncomeDetails = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME)
      if (response.data) {
        setIncomeData(response.data.data || [])
      }
    } catch (error) {
      console.error('Something went wrong. Please try again.', error)
      toast.error('Failed to fetch income details')
    } finally {
      setLoading(false)
    }
  }, [])

  const addIncome = async (income) => {
    const { source, amount, date, icon } = income

    // Basic validation
    if (!source.trim()) return toast.error('Source is required')
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error('Amount should be a valid number greater than 0')
    if (!date) return toast.error('Date is required')

    try {
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      })
      if (response.data) {
        toast.success('Income added successfully')
        fetchIncomeDetails()
        return true
      }
    } catch (error) {
      console.error('Error while adding income', error)
      toast.error(error.response?.data?.message || 'Error adding income')
      return false
    }
  }

  const editIncome = async (id, income) => {
    const { source, amount, date, icon } = income

    if (!source.trim()) return toast.error('Source is required')
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error('Amount should be a valid number greater than 0')
    if (!date) return toast.error('Date is required')

    try {
      const response = await axiosInstance.patch(
        API_PATHS.INCOME.UPDATE_INCOME(id),
        { source, amount, date, icon }
      )
      if (response.data) {
        toast.success('Income updated successfully')
        fetchIncomeDetails()
        return true
      }
    } catch (error) {
      console.error('Error while updating income', error)
      toast.error(error.response?.data?.message || 'Error updating income')
      return false
    }
  }

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))
      toast.success('Income deleted successfully')
      fetchIncomeDetails()
      return true
    } catch (error) {
      console.error('Error while deleting income', error)
      toast.error('Failed to delete income. Try again.')
      return false
    }
  }

  const downloadIncomeReport = async () => {
    return await downloadFile(
      API_PATHS.INCOME.DOWNLOAD_INCOME_EXCEL,
      'income-details.xlsx'
    )
  }

  return {
    incomeData,
    loading,
    fetchIncomeDetails,
    addIncome,
    editIncome,
    deleteIncome,
    downloadIncomeReport,
  }
}
