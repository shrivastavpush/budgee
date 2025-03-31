import moment from 'moment'
import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const ExpenseList = ({ transactions, onDelete, onDownload }) => {

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>All Expenses</h5>

                <button className='card-btn' onClick={onDownload}>
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
                        onDelete={() => {
                            console.log("Deleting Expense ID:", expense._id);
                            onDelete(expense._id)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default ExpenseList