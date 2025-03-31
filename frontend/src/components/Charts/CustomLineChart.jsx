import React from 'react'
import { XAxis, YAxis, Line, LineChart, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts'

const CustomLineChart = ({ data }) => {

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white shadow-md p-2 rounded-lg border border-gray-300'>
                    <p className='text-sm font-semibold text-purple-800 mb-1'>{payload[0].payload.category}</p>
                    <p className='text-sm text-gray-600'>
                        Amount: <span className='font-medium text-xs text-gray-900'>₹{payload[0].payload.amount}</span>
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className='bg-white'>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="incomeGrdient" x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='5%' stopColor='#875cf5' stopOpacity={0.4} />
                            <stop offset='95%' stopColor='#875cf5' stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
                    <Tooltip content={<CustomTooltip />} />

                    <Area type="monotone" dataKey="amount" stroke="#875cf5" fill="url(#incomeGrdient)" strokeWidth={3} dot={{ r: 3, fill: '#ad8df8' }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomLineChart