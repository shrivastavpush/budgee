import React, { useMemo } from 'react'
import { prepareExpenseLineChartData } from '../../utils/helper'
import CustomBarChart from '../Charts/CustomBarChart'
import Card from '../common/Card'

const Last30DayExpenses = ({ data }) => {
  const chartData = useMemo(() => prepareExpenseLineChartData(data), [data])

  return (
    <Card className="card">
      <div className="flex flex-col gap-4">
        <div>
          <h5>Last 30 days</h5>
          <p className="mt-1 text-sm text-gray-500">
            Your spending trend, month to date.
          </p>
        </div>

        {data?.length > 0 ? (
          <div className="w-full h-[300px]">
            <CustomBarChart
              data={chartData}
              color1="var(--accent-chart-light)"
              color2="var(--accent-chart-dark)"
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No expenses in the last 30 days</p>
            <p className="text-sm text-gray-400 mt-2">
              Add your first expense to see the chart
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default Last30DayExpenses
