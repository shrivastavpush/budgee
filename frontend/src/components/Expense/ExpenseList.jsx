import React from 'react'
import { LuDownload, LuHandCoins } from '../../utils/icons'
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
    <Card className="transaction-list-card">
      <div className="transaction-list-header">
        <div>
          <h5 className="text-lg">All expenses</h5>
          <p className="text-sm text-gray-500">
            Keep an eye on where your money goes.
          </p>
        </div>

        <button
          type="button"
          className={
            transactions?.length === 0 ? 'card-btn-disabled' : 'card-btn'
          }
          onClick={onDownload}
          disabled={transactions?.length === 0}
        >
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {transactions?.length ? (
        <div className="transaction-list-grid">
          {transactions.map((expense) => (
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
      ) : (
        <div className="transaction-empty">
          <span className="transaction-empty-icon">
            <LuHandCoins aria-hidden="true" />
          </span>
          <p className="font-semibold text-gray-900">No expenses yet</p>
          <p className="text-sm text-gray-500">
            Your spending activity will show up here.
          </p>
        </div>
      )}

      {pagination?.pages > 1 && (
        <div className="transaction-pagination">
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
