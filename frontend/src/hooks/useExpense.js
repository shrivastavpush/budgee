import { useState, useCallback, useRef } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { downloadFile } from '../utils/downloadUtils'
import toast from 'react-hot-toast'

const PAGE_SIZE = 20
const OVERVIEW_DAYS = 30

export const useExpense = () => {
  const [expenseData, setExpenseData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const pageRef = useRef(1)
  const listReqRef = useRef(0) // ignore out-of-order list responses
  const overviewReqRef = useRef(0)
  const [overview, setOverview] = useState([])

  const fetchExpenseDetails = useCallback(async (requestedPage) => {
    const nextPage =
      Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : pageRef.current || 1
    const reqId = ++listReqRef.current
    setLoading(true)
    try {
      let response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_ALL_EXPENSE,
        { params: { page: nextPage, limit: PAGE_SIZE } }
      )
      if (response.data) {
        let data = response.data.data || []
        let currentPage = nextPage
        if (data.length === 0 && nextPage > 1) {
          const lastPage = response.data.pagination?.pages || nextPage - 1
          currentPage = Math.max(1, Math.min(nextPage - 1, lastPage))
          response = await axiosInstance.get(
            API_PATHS.EXPENSE.GET_ALL_EXPENSE,
            { params: { page: currentPage, limit: PAGE_SIZE } }
          )
          data = response.data?.data || []
        }
        if (reqId !== listReqRef.current) return
        setExpenseData(data)
        setPagination(response.data.pagination)
        pageRef.current = response.data.pagination?.page || currentPage
      }
    } catch (error) {
      if (reqId !== listReqRef.current) return
      console.error('Something went wrong. Please try again.', error)
      toast.error('Failed to fetch expense details')
    } finally {
      if (reqId === listReqRef.current) setLoading(false)
    }
  }, [])

  // Daily totals across the whole window (not just the visible page).
  const fetchExpenseOverview = useCallback(async () => {
    const reqId = ++overviewReqRef.current
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.EXPENSE_OVERVIEW,
        {
          params: { days: OVERVIEW_DAYS },
        }
      )
      if (reqId === overviewReqRef.current) setOverview(response.data || [])
    } catch (error) {
      if (reqId !== overviewReqRef.current) return
      console.error('Failed to fetch expense overview', error)
      toast.error('Failed to load expense overview')
    }
  }, [])

  const addExpense = async (expense) => {
    const { category, amount, date, icon } = expense

    if (!category.trim()) {
      toast.error('Category is required')
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
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      })
      if (response.data) {
        toast.success('Expense added successfully')
        return true
      }
    } catch (error) {
      console.error('Error while adding expense', error)
      toast.error(error.response?.data?.message || 'Error adding expense')
      return false
    }
  }

  const editExpense = async (id, expense) => {
    const { category, amount, date, icon } = expense

    if (!category.trim()) {
      toast.error('Category is required')
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
        API_PATHS.EXPENSE.UPDATE_EXPENSE(id),
        { category, amount, date, icon }
      )
      if (response.data) {
        toast.success('Expense updated successfully')
        fetchExpenseDetails()
        return true
      }
    } catch (error) {
      console.error('Error while updating expense', error)
      toast.error(error.response?.data?.message || 'Error updating expense')
      return false
    }
  }

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      toast.success('Expense deleted successfully')
      fetchExpenseDetails()
      return true
    } catch (error) {
      console.error('Error while deleting expense', error)
      toast.error('Failed to delete expense. Try again.')
      return false
    }
  }

  const downloadExpenseReport = async ({ from, to } = {}) => {
    const params = {}
    if (from) params.from = from
    if (to) params.to = to
    return await downloadFile(
      API_PATHS.EXPENSE.DOWNLOAD_EXPENSE_EXCEL,
      'expense-details.xlsx',
      params
    )
  }

  return {
    expenseData,
    loading,
    pagination,
    overview,
    fetchExpenseOverview,
    fetchExpenseDetails,
    addExpense,
    editExpense,
    deleteExpense,
    downloadExpenseReport,
  }
}
