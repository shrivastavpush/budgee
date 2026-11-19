import React, { useEffect, useId, useRef } from 'react'
import { LuX } from '../utils/icons'

const Modal = ({ isOpen, onClose, title, children }) => {
  const titleId = useId()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="modal-dialog relative p-1 outline-none sm:p-2"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-surface">
          <div className="modal-header flex items-center justify-between">
            <h3
              id={titleId}
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              {title}
            </h3>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <LuX />
            </button>
          </div>

          <div className="modal-content space-y-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
