import React from 'react'

const DeleteAlert = ({ message, onDelete }) => {
    return (
        <div>
            <p className='text-sm'>{message}</p>
            <div className='flex items-center justify-end mt-6'>
                <button type='button' className='add-btn add-btn-fill' onClick={onDelete}>Delete</button>
            </div>
        </div>
    )
}

export default DeleteAlert