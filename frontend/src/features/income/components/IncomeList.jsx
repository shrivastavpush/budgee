import React, { useState } from 'react'
import { LuDownload, LuWalletMinimal } from '../../../shared/utils/icons'
import { formatTransactionDate } from '../../../shared/utils/helper'
import TransactionInfoCard from '../../../shared/ui/cards/TransactionInfoCard'
import Card from '../../../shared/ui/Card'
import ExportRange from '../../../shared/ui/ExportRange'

const IncomeList = ({
  transactions,
  onDelete,
  onEdit,
  onDownload,
  pagination,
  onPageChange,
}) => {
  const [range, setRange] = useState({ from: '', to: '' })

  return (
    <Card className="transaction-list-card">
      <div className="transaction-list-header">
        <div>
          <h5 className="text-lg">Income sources</h5>
          <p className="text-sm text-gray-500">
            A tidy view of every income stream.
          </p>
        </div>

        <ExportRange from={range.from} to={range.to} onChange={setRange} />

        <button
          type="button"
          className={
            transactions?.length === 0 ? 'card-btn-disabled' : 'card-btn'
          }
          onClick={() => onDownload(range)}
          disabled={transactions?.length === 0}
        >
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {transactions?.length ? (
        <div className="transaction-list-grid">
          {transactions.map((income) => (
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
      ) : (
        <div className="transaction-empty">
          <span className="transaction-empty-icon">
            <LuWalletMinimal aria-hidden="true" />
          </span>
          <p className="font-semibold text-gray-900">No income sources yet</p>
          <p className="text-sm text-gray-500">
            Add your first source to start tracking your progress.
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

export default IncomeList
