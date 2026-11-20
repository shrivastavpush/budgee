import React, { useEffect } from 'react'
import DashboardLayout from '../../../shared/layouts/DashboardLayout'
import { useUserAuth } from '../../auth/hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'

import InfoCard from '../../../shared/ui/cards/InfoCard'
import SkeletonCard from '../../../shared/ui/cards/SkeletonCard'
import { formatINR } from '../../../shared/utils/helper'
import {
  LuHandCoins,
  LuWalletMinimal,
  IoMdCard,
} from '../../../shared/utils/icons'

import RecentTransactions from '../components/RecentTransactions'
import FinanceOverview from '../components/FinanceOverview'
import ExpenseTransactoins from '../components/ExpenseTransactions'
import IncomeTransactoins from '../components/IncomeTransactions'
import Last30DayExpenses from '../components/Last30DayExpenses'
import RecentIncomeWithChart from '../components/RecentIncomeWithChart'

import { useDashboard } from '../hooks/useDashboard'
import { useIncome } from '../../income/hooks/useIncome'
import { useExpense } from '../../expense/hooks/useExpense'
import AddIncomeForm from '../../income/components/AddIncomeForm'
import AddExpenseForm from '../../expense/components/AddExpenseForm'
import FloatingActionButton from '../../../shared/ui/FloatingActionButton'
import Modal from '../../../shared/ui/Modal'

const Home = () => {
  useUserAuth()
  const navigate = useNavigate()
  const { dashboardData, loading, fetchDashboardData } = useDashboard()
  const { addIncome } = useIncome()
  const { addExpense } = useExpense()
  const [quickAddType, setQuickAddType] = React.useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleAddIncome = async (income) => {
    const success = await addIncome(income)
    if (success) {
      await fetchDashboardData()
      setQuickAddType(null)
    }
  }

  const handleAddExpense = async (expense) => {
    const success = await addExpense(expense)
    if (success) {
      await fetchDashboardData()
      setQuickAddType(null)
    }
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="space-y-6">
        <header className="page-heading flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="page-eyebrow">Your financial snapshot</p>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-description">
              A little clarity goes a long way.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                value={formatINR(dashboardData?.totalBalance || 0)}
                color="bg-violet-500"
              />
              <InfoCard
                icon={<LuWalletMinimal />}
                label="Total Income"
                value={formatINR(dashboardData?.totalIncome || 0)}
                color="bg-green-500"
              />
              <InfoCard
                icon={<LuHandCoins />}
                label="Total Expense"
                value={formatINR(dashboardData?.totalExpense || 0)}
                color="bg-red-500"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
                transactions={
                  dashboardData?.last30DaysExpenses?.transactions || []
                }
                onSeeMore={() => navigate('/expense')}
              />
            </>
          )}

          {loading ? (
            <>
              <SkeletonCard type="chart" />
              <SkeletonCard type="transaction" />
            </>
          ) : (
            <>
              <RecentIncomeWithChart
                data={
                  dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) ||
                  []
                }
              />
              <IncomeTransactoins
                transactions={
                  dashboardData?.last60DaysIncome?.transactions || []
                }
                onSeeMore={() => navigate('/income')}
              />
            </>
          )}
        </div>
      </div>

      <FloatingActionButton
        actions={[
          {
            label: 'Add income',
            icon: LuWalletMinimal,
            onClick: () => setQuickAddType('income'),
          },
          {
            label: 'Add expense',
            icon: LuHandCoins,
            onClick: () => setQuickAddType('expense'),
          },
        ]}
      />

      <Modal
        isOpen={quickAddType === 'income'}
        onClose={() => setQuickAddType(null)}
        title="Add income"
      >
        <AddIncomeForm onAddIncome={handleAddIncome} />
      </Modal>

      <Modal
        isOpen={quickAddType === 'expense'}
        onClose={() => setQuickAddType(null)}
        title="Add expense"
      >
        <AddExpenseForm onAddExpense={handleAddExpense} />
      </Modal>
    </DashboardLayout>
  )
}

export default Home
