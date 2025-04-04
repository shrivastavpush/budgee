import React from 'react'
import { addThousandSeparator } from '../../utils/helper'

const CustomTooltip = ({ active, payload, }) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
                <p className='text-sm font-semibold text-emerald-500 mb-1'>{payload[0].name}</p>
                <p className='text-sm text-gray-600'>Amount: <span className='text-sm font-medium text-gray-900'>
                    ₹{addThousandSeparator(payload[0].value)}
                </span>
                </p>
            </div>
        )
    }

    return null
}

export default CustomTooltip