import React from 'react'
import moment from 'moment'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const IncomeList = ({ transactions, onDelete, onDownload }) => {
    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Income Soruces</h5>

                <button className={transactions?.length === 0 ? 'card-btn-disabled' : 'card-btn'} onClick={onDownload}>
                    <LuDownload className='text-base' /> Download
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2'>
                {transactions?.map((income) => (
                    <TransactionInfoCard
                        type="income"
                        key={income._id}
                        title={income.source}
                        amount={income.amount}
                        date={moment(income.date).format("Do MM YYYY")}
                        icon={income.icon}
                        onDelete={() => onDelete(income._id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default IncomeList