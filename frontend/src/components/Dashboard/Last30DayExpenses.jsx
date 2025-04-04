import React, { useEffect, useState } from 'react'
import { prepareExpsenseChartData } from '../../utils/helper'
import CustomBarChart from '../Charts/CustomBarChart'

const Last30DayExpenses = ({ data }) => {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const result = prepareExpsenseChartData(data)
        setChartData(result)

        return () => { }
    }, [data])

    return (
        <div className='card'>
            <div className='flex flex-col gap-4'>
                <h5 className='text-lg'>Last 30 Days Expenses</h5>

                {data?.length > 0 ? (
                    <div className='w-full h-[300px]'>
                        <CustomBarChart data={chartData} color1="#B91C1C" color2="#EF4444" />
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No expenses in the last 30 days</p>
                        <p className="text-sm text-gray-400 mt-2">Add your first expense to see the chart</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Last30DayExpenses