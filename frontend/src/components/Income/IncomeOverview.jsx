import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../Charts/CustomBarChart'
import { prepareIncomeBarCharData } from '../../utils/helper'

const IncomeOverview = ({ transactions, onAddIncome }) => {

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const result = prepareIncomeBarCharData(transactions)
        setChartData(result)

        return () => { }
    }, [transactions])

    return (
        <div className='card'>
            <div className='flex justify-between items-center'>
                <div className=''>
                    <h5 className='text-lg'>Income Overview</h5>
                    <p className='text-sm text-gray-400 mt-0.5'>Track your earnings over time and analyze your income trends</p>
                </div>

                <button onClick={onAddIncome} className="add-btn">
                    <LuPlus className='text-lg' /> Add Income
                </button>
            </div>

            <div className='mt-10'>
                <CustomBarChart data={chartData} color1="#00c951" color2="#4ADE80" />
            </div>
        </div>
    )
}

export default IncomeOverview