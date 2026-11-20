import React, { useState } from 'react'
import Input from '../../../shared/ui/Input'
import EmojiPickerPopup from '../../../shared/ui/EmojiPickerPopup'

// Local (not UTC) YYYY-MM-DD for <input type="date">.
const today = () => new Date().toLocaleDateString('en-CA')

const AddIncomeForm = ({ onAddIncome, initialData }) => {
  const [income, setIncome] = useState(() => {
    if (initialData) {
      return {
        source: initialData.source || '',
        amount: initialData.amount || '',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : '',
        icon: initialData.icon || '',
      }
    }
    return {
      source: '',
      amount: '',
      date: today(),
      icon: '',
    }
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await onAddIncome(income)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (key, value) => {
    setIncome((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedItem) => handleChange('icon', selectedItem)}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={income.source}
          onChange={({ target }) => handleChange('source', target.value)}
          label="Income Source"
          placeholder="Freelance, Salary, etc."
          type="text"
        />

        <Input
          value={income.amount}
          onChange={({ target }) => handleChange('amount', target.value)}
          label="Income Amount (₹)"
          placeholder="Enter Income Amount"
          type="number"
          step="0.01"
          min="0.01"
        />

        <Input
          value={income.date}
          onChange={({ target }) => handleChange('date', target.value)}
          label="Income Date"
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
                ? 'Update Income'
                : 'Add Income'}
          </button>
        </div>
      </form>
    </>
  )
}

export default AddIncomeForm
