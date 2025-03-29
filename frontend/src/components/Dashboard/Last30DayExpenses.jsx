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
        <div className='card col-span-1'>
            <div className='flex items-center justify-between flex-col'>
                <h5 className='text-lg'>Last 30 Days Expenses</h5>

                <CustomBarChart
                    data={chartData}
                />
            </div>
        </div>
    )
}

export default Last30DayExpenses