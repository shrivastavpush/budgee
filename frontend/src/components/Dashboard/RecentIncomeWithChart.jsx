import React, { useEffect, useState } from 'react'
import CustomLineChart from '../Charts/CustomLineChart'

const RecentIncomeWithChart = ({ data }) => {

    const [chartData, setChartData] = useState([])

    const prepareChartData = () => {
        const dataArr = data?.map((item) => ({
            name: item?.source,
            amount: item?.amount
        }))

        setChartData(dataArr)
    }

    useEffect(() => {
        prepareChartData()

        return () => { }
    }, [data])

    return (
        <div className='card'>
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
        </div>
    )
}

export default RecentIncomeWithChart