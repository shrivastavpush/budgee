import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomBarChart = ({ data = [], color1, color2 }) => {

    const getBarColor = (index) => {
        return index % 2 === 0 ? color1 : color2
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white shadow-md rounded-lg p-2 bo border-gray-300'>
                    <p className='text-xs font-semibold text-purple-800 mb-1'>
                        {payload[0].payload.category}
                    </p>
                    <p className='text-xs font-semibold text-gray-600 mb-1'>
                        Amount: <span className='text-sm text-gray-900 font-medium'>₹{payload[0].payload.amount}
                        </span>
                    </p>
                </div>
            )
        }

        return null
    }

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
        <div className='bg-white mt-6'>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke='none' />

                    <XAxis dataKey='month' tick={{ fontSize: 12, fill: "#555" }} stroke='none' />
                    <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke='none' />

                    <Tooltip content={CustomTooltip} />

                    <Bar
                        dataKey="amount"
                        fill='#FF8042'
                        radius={[10, 10, 0, 0]}
                        activeDot={{ r: 8, fill: "yellow" }}
                        activeStyle={{ flil: "green" }} >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={getBarColor(index)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomBarChart