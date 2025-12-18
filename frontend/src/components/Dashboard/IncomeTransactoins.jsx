import React from 'react'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'
import { LuArrowRight } from 'react-icons/lu'

const IncomeTransactoins = ({ transactions, onSeeMore }) => {

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Income</h5>

        <button className='card-btn' onClick={onSeeMore}>
          See All <LuArrowRight className='text-base' />
        </button>
      </div>
      <div className="mt-6">
        {transactions?.length > 0 ? (
          transactions?.slice(0, 5)?.map((income) => (
            <TransactionInfoCard
              key={income._id}
              title={income.source}
              icon={income.icon}
              date={moment(income.date).format("Do MM YYYY")}
              amount={income.amount}
              type="income"
              hideDeleteBtn
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No income recorded yet</p>
            <p className="text-sm text-gray-400 mt-2">Add your first income source to start tracking</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default IncomeTransactoins