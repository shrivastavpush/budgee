import React from 'react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white shadow-md p-2 rounded-lg border border-gray-300'>
        <p className='text-sm font-semibold text-teal-600 mb-1'>{payload[0].payload.name || payload[0].payload.category}</p>
        <p className='text-sm text-gray-600'>
          Amount: <span className='font-medium text-xs text-gray-900'>₹{payload[0].payload.amount}</span>
        </p>
      </div>
    )
  }
  return null
}

const CustomLineChart = ({ data, stopColor, fillColor }) => {

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="text-center">
          <p className="text-gray-500">No data available</p>
          <p className="text-sm text-gray-400 mt-2">Add some data to see the chart</p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white'>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="Grdient" x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={stopColor} stopOpacity={0.4} />
              <stop offset='95%' stopColor={stopColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
          <Tooltip content={<CustomTooltip />} />

          <Area type="monotone" dataKey="amount" stroke={stopColor} fill="url(#Grdient)" strokeWidth={3} dot={{ r: 3, fill: fillColor }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomLineChart