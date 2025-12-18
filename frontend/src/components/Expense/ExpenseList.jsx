import React from 'react'
import moment from 'moment'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const ExpenseList = ({ transactions, onDelete, onEdit, onDownload }) => {
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>All Expenses</h5>

        <button className={transactions?.length === 0 ? 'card-btn-disabled' : 'card-btn'} onClick={onDownload}>
          <LuDownload className='text-base' /> Download
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2'>
        {transactions?.map((expense) => (
          <TransactionInfoCard
            type="expense"
            key={expense._id}
            title={expense.category}
            amount={expense.amount}
            date={moment(expense.date).format("Do MM YYYY")}
            icon={expense.icon}
            onDelete={() => onDelete(expense._id)}
            onEdit={() => onEdit(expense)}
          />
        ))}
      </div>
    </div>
  )
}

export default ExpenseList