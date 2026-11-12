import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'
import Card from '../common/Card'

const COLORS = ['#00c951', '#fb2c36']

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: 'Total Income', amount: Math.max(totalIncome, 0) },
    { name: 'Total Expenses', amount: Math.max(totalExpense, 0) },
  ].filter((item) => item.amount > 0)

  return (
    <Card className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial Overview</h5>
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
