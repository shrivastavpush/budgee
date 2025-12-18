import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Recent Transaction</h5>

        <button className='card-btn' onClick={onSeeMore}>See All<LuArrowRight className='text-base' /></button>
      </div>

      <div className='mt-6'>
        {transactions?.length > 0 ? (
          transactions?.slice(0, 5)?.map((item) => {
            return <TransactionInfoCard
              key={item._id}
              title={item.type == 'expense' ? item.category : item.source}
              icon={item.icon}
              date={moment(item.date).format("Do MMM YYYY")}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-2">Start by adding your first income or expense</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentTransactions