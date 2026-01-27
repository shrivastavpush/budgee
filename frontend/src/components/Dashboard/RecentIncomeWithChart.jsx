import React, { useMemo } from 'react'
import CustomLineChart from '../Charts/CustomLineChart'
import Card from '../common/Card'

const RecentIncomeWithChart = ({ data }) => {

  const chartData = useMemo(() => {
    return data?.map((item) => ({
      name: item?.source,
      amount: item?.amount
    })) || []
  }, [data])

  return (
    <Card className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Last 60 Days Income</h5>
      </div>

      {data?.length > 0 ? (
        <div className='w-full h-[300px] mt-6'>
          <CustomLineChart data={chartData} stopColor="#00c951" fillColor="#00c951" />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No income in the last 60 days</p>
          <p className="text-sm text-gray-400 mt-2">Add your first income to see the chart</p>
        </div>
      )}
    </Card>
  )
}

export default RecentIncomeWithChart