import React from 'react'
import { LuDownload } from '../../utils/icons'
import { formatTransactionDate } from '../../utils/helper'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import Card from '../common/Card'

const ExpenseList = ({
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
        <h5 className="text-lg">All Expenses</h5>

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
        {transactions?.map((expense) => (
          <TransactionInfoCard
            type="expense"
            key={expense._id}
            title={expense.category}
            amount={expense.amount}
            date={formatTransactionDate(expense.date)}
            icon={expense.icon}
            onDelete={() => onDelete(expense._id)}
            onEdit={() => onEdit(expense)}
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

export default ExpenseList
