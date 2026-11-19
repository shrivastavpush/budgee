import React from 'react'

const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-block ${className}`} aria-hidden="true" />
)

const SkeletonCard = ({ type = 'info', count = 1 }) => {
  if (type === 'info') {
    return (
      <div className="skeleton-card flex gap-4 p-5 sm:p-6" role="status">
        <SkeletonBlock className="h-12 w-12 shrink-0 rounded-2xl skeleton-accent" />
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-4 w-24 rounded-md" />
          <SkeletonBlock className="h-7 w-32 rounded-md" />
        </div>
        <span className="sr-only">Loading summary</span>
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <div className="skeleton-card p-5 sm:p-6" role="status">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-40 rounded-md" />
            <SkeletonBlock className="h-4 w-64 max-w-full rounded-md" />
          </div>
          <SkeletonBlock className="h-10 w-32 shrink-0 rounded-xl skeleton-accent" />
        </div>
        <SkeletonBlock className="h-60 rounded-xl" />
        <span className="sr-only">Loading chart</span>
      </div>
    )
  }

  if (type === 'transaction') {
    return (
      <div className="skeleton-card p-5 sm:p-6" role="status">
        <div className="mb-6 flex items-center justify-between gap-4">
          <SkeletonBlock className="h-6 w-32 rounded-md" />
          <SkeletonBlock className="h-8 w-24 rounded-xl skeleton-accent" />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl border border-gray-200/50 bg-gray-50 p-4"
              aria-hidden="true"
            >
              <SkeletonBlock className="h-11 w-11 shrink-0 rounded-full skeleton-accent" />
              <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-32 max-w-full rounded-md" />
                <SkeletonBlock className="h-3 w-24 max-w-full rounded-md" />
              </div>
              <SkeletonBlock className="h-5 w-20 shrink-0 rounded-md" />
            </div>
          ))}
        </div>
        <span className="sr-only">Loading transactions</span>
      </div>
    )
  }

  if (type === 'form') {
    return (
      <div className="skeleton-card p-6" role="status">
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <SkeletonBlock className="h-4 w-24 rounded-md" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
          ))}
          <SkeletonBlock className="h-11 w-32 rounded-xl skeleton-accent" />
        </div>
        <span className="sr-only">Loading form</span>
      </div>
    )
  }

  if (type === 'modal') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        role="status"
      >
        <div className="skeleton-card w-full max-w-md p-6">
          <SkeletonBlock className="mb-6 h-6 w-32 rounded-md" />
          <div className="space-y-4">
            <SkeletonBlock className="h-4 w-full rounded-md" />
            <SkeletonBlock className="h-4 w-3/4 rounded-md" />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <SkeletonBlock className="h-10 w-20 rounded-xl" />
            <SkeletonBlock className="h-10 w-20 rounded-xl skeleton-accent" />
          </div>
        </div>
        <span className="sr-only">Loading dialog</span>
      </div>
    )
  }

  if (type === 'empty') {
    return (
      <div className="skeleton-card p-6" role="status">
        <div className="flex flex-col items-center justify-center py-8">
          <SkeletonBlock className="mb-4 h-16 w-16 rounded-full skeleton-accent" />
          <SkeletonBlock className="mb-2 h-4 w-48 max-w-full rounded-md" />
          <SkeletonBlock className="h-3 w-64 max-w-full rounded-md" />
        </div>
        <span className="sr-only">Loading empty state</span>
      </div>
    )
  }

  return null
}

export default SkeletonCard
