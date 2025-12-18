import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className='group flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1'>
      <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className='flex-1'>
        <h6 className='text-sm text-gray-500 mb-1 group-hover:text-gray-600 transition-colors duration-300'>{label}</h6>
        <span className='text-[22px] font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300'>₹{value}</span>
      </div>
    </div>
  )
}

export default InfoCard