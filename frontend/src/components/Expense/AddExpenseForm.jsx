import React, { useState, useEffect } from 'react'
import EmojiPickerPopup from '../EmojiPickerPopup'
import Input from '../Inputs/Input'

const AddExpenseForm = ({ onAddExpense, initialData }) => {

    const [expense, setExpense] = useState({
        amount: '',
        icon: '',
        category: '',
        date: '',
    })

    useEffect(() => {
        if (initialData) {
            setExpense({
                category: initialData.category || '',
                amount: initialData.amount || '',
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
                icon: initialData.icon || '',
            })
        }
    }, [initialData])

    const handleChange = (key, value) => {
        setExpense((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <>
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedItem) => handleChange('icon', selectedItem)}
            />

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
                label="Expense Amount"
                placeholder="Enter Expense Amount"
                type="number"
            />

            <Input
                value={expense.date}
                onChange={({ target }) => handleChange('date', target.value)}
                label="Expense Date"
                type="date"
            />

            <div className='flex justify-end m-6'>
                <button
                    type='button'
                    className='add-btn add-btn-fill'
                    onClick={() => onAddExpense(expense)}>
                    {initialData ? 'Update Expense' : 'Add Expense'}
                </button>
            </div>
        </>
    )
}

export default AddExpenseForm