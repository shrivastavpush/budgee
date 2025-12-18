import React from 'react'

const SkeletonCard = ({ type = 'info', count = 1 }) => {
  // Info Card Skeleton (used for dashboard overview cards)
  if (type === 'info') {
    return (
      <div className='flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 animate-pulse'>
        <div className='w-14 h-14 bg-gray-200 rounded-full'></div>
        <div className='flex-1'>
          <div className='h-4 w-24 bg-gray-200 rounded mb-3'></div>
          <div className='h-8 w-32 bg-gray-200 rounded'></div>
        </div>
      </div>
    )
  }

  // Chart Card Skeleton (used for overview charts)
  if (type === 'chart') {
    return (
      <div className='bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 animate-pulse'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <div className='h-6 w-40 bg-gray-200 rounded mb-2'></div>
            <div className='h-4 w-64 bg-gray-200 rounded'></div>
          </div>
          <div className='h-10 w-32 bg-gray-200 rounded'></div>
        </div>
        <div className='h-60 bg-gray-200 rounded'></div>
      </div>
    )
  }

  // Transaction List Skeleton (used for income/expense lists)
  if (type === 'transaction') {
    return (
      <div className='bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 animate-pulse'>
        <div className='flex items-center justify-between mb-6'>
          <div className='h-6 w-32 bg-gray-200 rounded'></div>
          <div className='h-8 w-24 bg-gray-200 rounded'></div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
              <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
              <div className='flex-1'>
                <div className='h-4 w-32 bg-gray-200 rounded mb-2'></div>
                <div className='h-3 w-24 bg-gray-200 rounded'></div>
              </div>
              <div className='h-4 w-20 bg-gray-200 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Form Skeleton (used for add/edit forms)
  if (type === 'form') {
    return (
      <div className='bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 animate-pulse'>
        <div className='space-y-6'>
          <div>
            <div className='h-4 w-24 bg-gray-200 rounded mb-2'></div>
            <div className='h-10 w-full bg-gray-200 rounded'></div>
          </div>
          <div>
            <div className='h-4 w-24 bg-gray-200 rounded mb-2'></div>
            <div className='h-10 w-full bg-gray-200 rounded'></div>
          </div>
          <div>
            <div className='h-4 w-24 bg-gray-200 rounded mb-2'></div>
            <div className='h-10 w-full bg-gray-200 rounded'></div>
          </div>
          <div className='h-10 w-32 bg-gray-200 rounded'></div>
        </div>
      </div>
    )
  }

  // Modal Skeleton (used for loading modals)
  if (type === 'modal') {
    return (
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl shadow-lg w-full max-w-md animate-pulse'>
          <div className='p-6'>
            <div className='h-6 w-32 bg-gray-200 rounded mb-6'></div>
            <div className='space-y-4'>
              <div className='h-4 w-full bg-gray-200 rounded'></div>
              <div className='h-4 w-3/4 bg-gray-200 rounded'></div>
            </div>
            <div className='flex justify-end gap-4 mt-6'>
              <div className='h-10 w-20 bg-gray-200 rounded'></div>
              <div className='h-10 w-20 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Empty State Skeleton (used when no data is available)
  if (type === 'empty') {
    return (
      <div className='bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 animate-pulse'>
        <div className='flex flex-col items-center justify-center py-8'>
          <div className='w-16 h-16 bg-gray-200 rounded-full mb-4'></div>
          <div className='h-4 w-48 bg-gray-200 rounded mb-2'></div>
          <div className='h-3 w-64 bg-gray-200 rounded'></div>
        </div>
      </div>
    )
  }

  return null
}

export default SkeletonCard 