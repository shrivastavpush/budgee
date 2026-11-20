import { useState, useCallback, useRef } from 'react'
import axiosInstance from '../../../shared/utils/axiosInstance'
import { API_PATHS } from '../../../shared/utils/apiPaths'
import { downloadFile } from '../../../shared/utils/downloadUtils'
import toast from 'react-hot-toast'

const PAGE_SIZE = 20
const OVERVIEW_DAYS = 60

export const useIncome = () => {
  const [incomeData, setIncomeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const pageRef = useRef(1)
  const listReqRef = useRef(0) // ignore out-of-order list responses
  const overviewReqRef = useRef(0)
  const [overview, setOverview] = useState([])

  const fetchIncomeDetails = useCallback(async (requestedPage) => {
    const nextPage =
      Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : pageRef.current || 1
    const reqId = ++listReqRef.current
    setLoading(true)
    try {
      let response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME, {
        params: { page: nextPage, limit: PAGE_SIZE },
      })
      if (response.data) {
        let data = response.data.data || []
        let currentPage = nextPage
        if (data.length === 0 && nextPage > 1) {
          const lastPage = response.data.pagination?.pages || nextPage - 1
          currentPage = Math.max(1, Math.min(nextPage - 1, lastPage))
          response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME, {
            params: { page: currentPage, limit: PAGE_SIZE },
          })
          data = response.data?.data || []
        }
        if (reqId !== listReqRef.current) return
        setIncomeData(data)
        setPagination(response.data.pagination)
        pageRef.current = response.data.pagination?.page || currentPage
      }
    } catch (error) {
      if (reqId !== listReqRef.current) return
      console.error('Something went wrong. Please try again.', error)
      toast.error('Failed to fetch income details')
    } finally {
      if (reqId === listReqRef.current) setLoading(false)
    }
  }, [])

  // Daily totals across the whole window (not just the visible page).
  const fetchIncomeOverview = useCallback(async () => {
    const reqId = ++overviewReqRef.current
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.INCOME_OVERVIEW,
        {
          params: { days: OVERVIEW_DAYS },
        }
      )
      if (reqId === overviewReqRef.current) setOverview(response.data || [])
    } catch (error) {
      if (reqId !== overviewReqRef.current) return
      console.error('Failed to fetch income overview', error)
      toast.error('Failed to load income overview')
    }
  }, [])

  const addIncome = async (income) => {
    const { source, amount, date, icon } = income

    // Basic validation
    if (!source.trim()) {
      toast.error('Source is required')
      return false
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Amount should be a valid number greater than 0')
      return false
    }
    if (!date) {
      toast.error('Date is required')
      return false
    }

    try {
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      })
      if (response.data) {
        toast.success('Income added successfully')
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

    if (!source.trim()) {
      toast.error('Source is required')
      return false
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Amount should be a valid number greater than 0')
      return false
    }
    if (!date) {
      toast.error('Date is required')
      return false
    }

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

  const downloadIncomeReport = async ({ from, to } = {}) => {
    const params = {}
    if (from) params.from = from
    if (to) params.to = to
    return await downloadFile(
      API_PATHS.INCOME.DOWNLOAD_INCOME_EXCEL,
      'income-details.xlsx',
      params
    )
  }

  return {
    incomeData,
    loading,
    pagination,
    overview,
    fetchIncomeOverview,
    fetchIncomeDetails,
    addIncome,
    editIncome,
    deleteIncome,
    downloadIncomeReport,
  }
}
