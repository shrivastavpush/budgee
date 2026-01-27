import React, { useMemo } from 'react'
import { LuPlus } from '../../utils/icons'
import CustomBarChart from '../Charts/CustomBarChart'
import { prepareIncomeBarCharData } from '../../utils/helper'
import Card from '../common/Card'

const IncomeOverview = ({ transactions, onAddIncome }) => {

  const chartData = useMemo(() => prepareIncomeBarCharData(transactions), [transactions])

  return (
    <Card className='card'>
      <div className='flex justify-between items-center'>
        <div className=''>
          <h5 className='text-lg'>Income Overview</h5>
          <p className='text-sm text-gray-400 mt-0.5'>Track your earnings over time and analyze your income trends</p>
        </div>

        <button onClick={onAddIncome} className="add-btn">
          <LuPlus className='text-lg' /> Add Income
        </button>
      </div>

      <div className='mt-10'>
        <CustomBarChart data={chartData} color1="#00c951" color2="#4ADE80" />
      </div>
    </Card>
  )
}

export default IncomeOverview