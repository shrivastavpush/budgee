import React, { useState } from 'react'
import Input from '../../components/Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: '',
        amount: '',
        date: '',
        icon: '',
    })

    const handleChange = (key, value) => {
        setIncome((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedItem) => handleChange('icon', selectedItem)}
            />

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
                label="Income Amount"
                placeholder="Enter Income Amount"
                type="number"
            />

            <Input
                value={income.date}
                onChange={({ target }) => handleChange('date', target.value)}
                label="Income Date"
                type="date"
            />

            <div className='flex justify-end m-6'>
                <button
                    type='button'
                    className='add-btn add-btn-fill'
                    onClick={() => onAddIncome(income)}>Add Income</button>
            </div>
        </>
    )
}

export default AddIncomeForm
