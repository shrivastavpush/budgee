import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="summary-card group flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 sm:p-6">
      <div
        className={`summary-card-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl text-white ${color} transition-transform duration-300 group-hover:scale-105`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h6 className="summary-card-label mb-1 text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
          {label}
        </h6>
        <span className="summary-card-value text-[22px] font-bold tracking-tight text-gray-900 tabular-nums">
          {value}
        </span>
      </div>
    </div>
  )
}

export default InfoCard
