import React from 'react'
import { LuDownload } from '../../utils/icons'
import { formatTransactionDate } from '../../utils/helper'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import Card from '../common/Card'

const IncomeList = ({
  transactions,
  onDelete,
  onEdit,
  onDownload,
  pagination,
  onPageChange,
}) => {
  return (
    <Card className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>

        <button
          className={
            transactions?.length === 0 ? 'card-btn-disabled' : 'card-btn'
          }
          onClick={onDownload}
        >
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((income) => (
          <TransactionInfoCard
            type="income"
            key={income._id}
            title={income.source}
            amount={income.amount}
            date={formatTransactionDate(income.date)}
            icon={income.icon}
            onDelete={() => onDelete(income._id)}
            onEdit={() => onEdit(income)}
          />
        ))}
      </div>

      {pagination?.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            className="card-btn"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            type="button"
            className="card-btn"
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </Card>
  )
}

export default IncomeList
