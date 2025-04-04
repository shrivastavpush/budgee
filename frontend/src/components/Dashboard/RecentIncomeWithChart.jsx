import React, { useEffect, useState } from 'react'
import CustomLineChart from '../Charts/CustomLineChart'
const RecentIncomeWithChart = ({ data }) => {

    const [chartData, setChartData] = useState([])

    const COLORS = ["#000000", "#22C55E", "#EF4444"]

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

            <div className='w-full h-[300px] mt-6'>
                <CustomLineChart data={chartData} stopColor="#22C55E" fillColor="#15803D" />
            </div>
        </div>
    )
}

export default RecentIncomeWithChart