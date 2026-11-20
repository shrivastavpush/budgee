import React, { useMemo } from 'react'
import CustomBarChart from '../Charts/CustomBarChart'
import { prepareOverviewData } from '../../utils/helper'
import Card from '../common/Card'

const IncomeOverview = ({ data }) => {
  const chartData = useMemo(() => prepareOverviewData(data), [data])

  return (
    <Card className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5>Income overview</h5>
          <p className="text-sm text-gray-400 mt-0.5">
            Track your earnings over time and analyze your income trends
          </p>
        </div>
      </div>

      <div className="mt-5">
        <CustomBarChart
          data={chartData}
          color1="var(--accent-chart-light)"
          color2="var(--accent-chart-dark)"
        />
      </div>
    </Card>
  )
}

export default IncomeOverview
