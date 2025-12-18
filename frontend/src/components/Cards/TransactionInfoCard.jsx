import React from 'react'
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2, TbEdit } from '../../utils/icons'
import { addThousandSeparator } from '../../utils/helper'

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete, onEdit }) => {

  const getAmountStyles = () => type === 'income'
    ? 'bg-green-50 text-green-500'
    : 'bg-red-50 text-red-500'

  return (
    <div className='group relative flex items-center gap-4 mt-2 p-2 md:p-3 rounded-lg hover:bg-teal-100/30'>
      <div className='w-12 h-12 flex items-center justify-center text-xl text-teal-800 bg-teal-50 rounded-full'>
        {icon ? (
          <img src={icon} alt={title} className='w-6 h-6' />
        ) : (
          <LuUtensils />
        )}
      </div>

      <div className='flex-1 flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-700 font-medium'>{title}</p>
          <p className='text-xs text-gray-400'>{date}</p>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        {!hideDeleteBtn && (
          <>
            <button
              className='text-gray-400 hover:text-teal-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer'
              onClick={onEdit}>
              <TbEdit size={18} />
            </button>
            <button
              className='text-gray-400 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer'
              onClick={onDelete}>
              <LuTrash2 size={18} />
            </button>
          </>
        )}
      </div>

      <div className={`flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 rounded-md ${getAmountStyles()}`}>
        <h6 className='text-xs font-medium'>
          {type === "income" ? "+" : "-"} ₹{addThousandSeparator(amount)}
        </h6>

        {type === "income"
          ? <LuTrendingUp />
          : <LuTrendingDown />}
      </div>
    </div>
  )
}

export default TransactionInfoCard