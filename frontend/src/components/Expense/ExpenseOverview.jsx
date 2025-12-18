import React, { useMemo } from 'react'
import { LuPlus } from '../../utils/icons'
import CustomLineChart from '../Charts/CustomLineChart'
import { prepareExpenseLineChartData } from '../../utils/helper'

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const chartData = useMemo(() => prepareExpenseLineChartData(transactions), [transactions])

  return (
    <div className='card'>
      <div className='flex justify-between items-center'>
        <div className=''>
          <h5 className='text-lg'>Expense Overview</h5>
          <p className='text-sm text-gray-400 mt-0.5'>Track your spending over time and analyze your expense trends</p>
        </div>

        <button onClick={onAddExpense} className="add-btn">
          <LuPlus className='text-lg' /> Add Expense
        </button>
      </div>

      <div className='mt-10'>
        <CustomLineChart data={chartData} stopColor="#fb2c2c" fillColor="#fb2c2c" />
      </div>
    </div>
  )
}

export default ExpenseOverview