import React from 'react'
import CustomPieChart from '../../../shared/charts/CustomPieChart'
import Card from '../../../shared/ui/Card'

const COLORS = ['var(--accent-chart-light)', 'var(--accent-chart-dark)']

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: 'Total Income', amount: Math.max(totalIncome, 0) },
    { name: 'Total Expenses', amount: Math.max(totalExpense, 0) },
  ].filter((item) => item.amount > 0)

  return (
    <Card className="card">
      <div className="mb-1">
        <h5>Financial overview</h5>
        <p className="mt-1 text-sm text-gray-500">
          Your income and spending, side by side.
        </p>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`₹${totalBalance}`}
        colors={COLORS}
        showTextAnchor
      />
    </Card>
  )
}

export default FinanceOverview
