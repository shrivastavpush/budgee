import React, { useEffect, useState, useCallback } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

import InfoCard from '../../components/Cards/InfoCard'
import { addThousandSeparator } from '../../utils/helper'
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu'
import { IoMdCard } from 'react-icons/io'
import toast from 'react-hot-toast'

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
    const [error, setError] = useState(null)

    const fetchDashboardData = useCallback(async () => {
        if (loading) return

        setLoading(true)
        setError(null)

        try {
            const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`)
            if (response.data) {
                setDashboardData(response.data)
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
            toast.error("Failed to load dashboard data. Please try again.")
            setError("Failed to load dashboard data. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [loading])

    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    // Implement periodic refresh (every 5 minutes)
    useEffect(() => {
        const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [fetchDashboardData])

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className='my-5 mx-auto'>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <InfoCard
                        icon={<IoMdCard />}
                        label="Total Balance"
                        value={addThousandSeparator(dashboardData?.totalBalance || 0)}
                        color="bg-primary"
                        loading={loading}
                    />

                    <InfoCard
                        icon={<LuWalletMinimal />}
                        label="Total Income"
                        value={addThousandSeparator(dashboardData?.totalIncome || 0)}
                        color="bg-orange-500"
                        loading={loading}
                    />

                    <InfoCard
                        icon={<LuHandCoins />}
                        label="Total Expense"
                        value={addThousandSeparator(dashboardData?.totalExpense || 0)}
                        color="bg-red-500"
                        loading={loading}
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <RecentTransactions
                        transactions={dashboardData?.recentTransactions}
                        onSeeMore={() => navigate('/expense')}
                        loading={loading}
                    />

                    <FinanceOverview
                        totalBalance={dashboardData?.totalBalance || 0}
                        totalIncome={dashboardData?.totalIncome || 0}
                        totalExpense={dashboardData?.totalExpense || 0}
                        loading={loading}
                    />

                    <ExpenseTransactoins
                        transactions={dashboardData?.last30DaysExpenses?.transactions || []}
                        onSeeMore={() => navigate('/expense')}
                        loading={loading}
                    />

                    <Last30DayExpenses
                        data={dashboardData?.last30DaysExpenses?.transactions || []}
                        loading={loading}
                    />

                    <RecentIncomeWithChart
                        data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
                        totalIncome={dashboardData?.totalIncome || 0}
                        loading={loading}
                    />

                    <IncomeTransactoins
                        transactions={dashboardData?.last60DaysIncome?.transactions || []}
                        onSeeMore={() => navigate('/income')}
                        loading={loading}
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Home