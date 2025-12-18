import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import CustomTooltip from './CustomTooltip'
import CustomLegend from './CustomLegend'

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[380px]">
        <div className="text-center">
          <p className="text-gray-500">No data available</p>
          <p className="text-sm text-gray-400 mt-2">Add some data to see the chart</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => {
            return <Cell key={`cell-${index}`} fill={colors[index & colors.length]} />
          })}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend content={CustomLegend} />

        {showTextAnchor && (
          <g>
            <text
              x="50%"
              y="50%"
              dy={-20}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={10}
              textAnchor="middle"
              fill="#333"
              fontSize="24px"
              fontWeight="600"
            >
              {totalAmount}
            </text>
          </g>
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CustomPieChart