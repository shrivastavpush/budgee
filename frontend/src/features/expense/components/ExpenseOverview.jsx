import React, { useMemo } from 'react'
import CustomLineChart from '../../../shared/charts/CustomLineChart'
import { prepareOverviewData } from '../../../shared/utils/helper'
import Card from '../../../shared/ui/Card'

const ExpenseOverview = ({ data }) => {
  const chartData = useMemo(() => prepareOverviewData(data), [data])

  return (
    <Card className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5>Spending overview</h5>
          <p className="text-sm text-gray-400 mt-0.5">
            Track your spending over time and analyze your expense trends
          </p>
        </div>
      </div>

      <div className="mt-5">
        <CustomLineChart
          data={chartData}
          stopColor="var(--accent-chart-dark)"
          fillColor="var(--accent-chart-light)"
        />
      </div>
    </Card>
  )
}

export default ExpenseOverview
