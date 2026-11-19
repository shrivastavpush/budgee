import React from 'react'
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
  TbEdit,
} from '../../utils/icons'
import { addThousandSeparator } from '../../utils/helper'

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
  onEdit,
}) => {
  const isIncome = type === 'income'

  return (
    <article
      className={`transaction-row group ${isIncome ? 'is-income' : 'is-expense'}`}
    >
      <div className="transaction-icon">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6" />
        ) : (
          <LuUtensils />
        )}
      </div>

      <div className="transaction-main">
        <div className="transaction-copy">
          <p className="transaction-title">{title}</p>
          <p className="transaction-date">{date}</p>
        </div>

        {!hideDeleteBtn && (
          <div className="transaction-actions">
            <button
              type="button"
              className="transaction-action"
              aria-label={`Edit ${title}`}
              onClick={onEdit}
            >
              <TbEdit size={18} />
            </button>
            <button
              type="button"
              className="transaction-action is-danger"
              aria-label={`Delete ${title}`}
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div
        className={`transaction-amount ${isIncome ? 'is-income' : 'is-expense'}`}
      >
        <span>
          {isIncome ? '+' : '-'} ₹{addThousandSeparator(amount)}
        </span>
        {isIncome ? (
          <LuTrendingUp aria-hidden="true" />
        ) : (
          <LuTrendingDown aria-hidden="true" />
        )}
      </div>
    </article>
  )
}

export default TransactionInfoCard
