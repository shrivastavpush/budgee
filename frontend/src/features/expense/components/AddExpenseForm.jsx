import React, { useState } from 'react'
import EmojiPickerPopup from '../../../shared/ui/EmojiPickerPopup'
import Input from '../../../shared/ui/Input'

// Local (not UTC) YYYY-MM-DD for <input type="date">.
const today = () => new Date().toLocaleDateString('en-CA')

const AddExpenseForm = ({ onAddExpense, initialData }) => {
  const [expense, setExpense] = useState(() => {
    if (initialData) {
      return {
        amount: initialData.amount || '',
        icon: initialData.icon || '',
        category: initialData.category || '',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : '',
      }
    }
    return {
      amount: '',
      icon: '',
      category: '',
      date: today(),
    }
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await onAddExpense(expense)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (key, value) => {
    setExpense((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedItem) => handleChange('icon', selectedItem)}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={expense.category}
          onChange={({ target }) => handleChange('category', target.value)}
          label="Expense Category"
          placeholder="Enter Expense Category"
          type="text"
        />

        <Input
          value={expense.amount}
          onChange={({ target }) => handleChange('amount', target.value)}
          label="Expense Amount (₹)"
          placeholder="Enter Expense Amount"
          type="number"
          step="0.01"
          min="0.01"
        />

        <Input
          value={expense.date}
          onChange={({ target }) => handleChange('date', target.value)}
          label="Expense Date"
          type="date"
        />

        <div className="flex justify-end my-6">
          <button
            type="submit"
            className="add-btn add-btn-fill"
            disabled={submitting}
          >
            {submitting
              ? 'Saving...'
              : initialData
                ? 'Update Expense'
                : 'Add Expense'}
          </button>
        </div>
      </form>
    </>
  )
}

export default AddExpenseForm
