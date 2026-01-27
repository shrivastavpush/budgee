import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'
import Card from '../common/Card'

const COLORS = ['#8e51ff', '#00c951', '#fb2c36']

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: 'Total Balance', amount: totalBalance },
    { name: 'Total Income', amount: totalIncome },
    { name: 'Total Expenses', amount: totalExpense },
  ]

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
