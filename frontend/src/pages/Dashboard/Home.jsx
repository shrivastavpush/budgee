import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

import InfoCard from '../../components/Cards/InfoCard'
import SkeletonCard from '../../components/Cards/SkeletonCard'
import { addThousandSeparator } from '../../utils/helper'
import { LuHandCoins, LuWalletMinimal, IoMdCard } from '../../utils/icons'

import RecentTransactions from '../../components/Dashboard/RecentTransactions'
import FinanceOverview from '../../components/Dashboard/FinanceOverview'
import ExpenseTransactoins from '../../components/Dashboard/ExpenseTransactoins'
import IncomeTransactoins from '../../components/Dashboard/IncomeTransactoins'
import Last30DayExpenses from '../../components/Dashboard/Last30DayExpenses'
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart'

const Home = () => {
  useUserAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDashboardData = async () => {
    if (loading) return true
    setLoading(true)

    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`)
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    return () => { }
  }, [])

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Info Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading ? (
            <>
              <SkeletonCard type="info" />
              <SkeletonCard type="info" />
              <SkeletonCard type="info" />
            </>
          ) : (
            <>
              <InfoCard
                icon={<IoMdCard />}
                label="Total Balance"
                value={addThousandSeparator(dashboardData?.totalBalance || 0)}
                color="bg-violet-500"
              />
              <InfoCard
                icon={<LuWalletMinimal />}
                label="Total Income"
                value={addThousandSeparator(dashboardData?.totalIncome || 0)}
                color="bg-green-500"
              />
              <InfoCard
                icon={<LuHandCoins />}
                label="Total Expense"
                value={addThousandSeparator(dashboardData?.totalExpense || 0)}
                color="bg-red-500"
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
          {/* First Row */}
          {loading ? (
            <>
              <SkeletonCard type="chart" />
              <SkeletonCard type="transaction" />
            </>
          ) : (
            <>
              <FinanceOverview
                totalBalance={dashboardData?.totalBalance || 0}
                totalIncome={dashboardData?.totalIncome || 0}
                totalExpense={dashboardData?.totalExpense || 0}
              />
              <RecentTransactions
                transactions={dashboardData?.recentTransactions}
                onSeeMore={() => navigate('/expense')}
              />
            </>
          )}

          {/* Second Row */}
          {loading ? (
            <>
              <SkeletonCard type="chart" />
              <SkeletonCard type="transaction" />
            </>
          ) : (
            <>
              <Last30DayExpenses
                data={dashboardData?.last30DaysExpenses?.transactions || []}
              />
              <ExpenseTransactoins
                transactions={dashboardData?.last30DaysExpenses?.transactions || []}
                onSeeMore={() => navigate('/expense')}
              />
            </>
          )}

          {/* Third Row */}
          {loading ? (
            <>
              <SkeletonCard type="chart" />
              <SkeletonCard type="transaction" />
            </>
          ) : (
            <>
              <RecentIncomeWithChart
                data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
              />
              <IncomeTransactoins
                transactions={dashboardData?.last60DaysIncome?.transactions || []}
                onSeeMore={() => navigate('/income')}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home