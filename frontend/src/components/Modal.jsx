import React from 'react'
import { LuX } from 'react-icons/lu'

const Modal = ({ isOpen, onClose, title, children }) => {

    if (!isOpen) return null

    return (
        <div className='fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-5'>
            <div className='relative w-full max-w-2xl max-h-full p-4'>

                {/* modal content */}
                <div className='relative bg-white rounded-lg shadow-sm'>

                    {/* modal header */}
                    <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200'>
                        <h3 className='text-lg font-medium text-gray-900 '>{title}</h3>
                        <button
                            type='button'
                            onClick={onClose}
                            className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center cursor-pointer'>
                            <LuX />
                        </button>
                    </div>

                    {/* modal body */}
                    <div className='p-4 md:p-5 space-y-4'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal