import React from 'react'
import { LuArrowRight } from '../../utils/icons'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const ExpenseTransactoins = ({ transactions, onSeeMore }) => {

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Expenses</h5>

        <button className='card-btn' onClick={onSeeMore}>
          See All <LuArrowRight className='text-base' />
        </button>
      </div>
      <div className="mt-6">
        {transactions?.length > 0 ? (
          transactions?.slice(0, 5)?.map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              date={moment(expense.date).format("Do MM YYYY")}
              amount={expense.amount}
              type="expense"
              hideDeleteBtn
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No expenses recorded yet</p>
            <p className="text-sm text-gray-400 mt-2">Add your first expense to start tracking</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseTransactoins