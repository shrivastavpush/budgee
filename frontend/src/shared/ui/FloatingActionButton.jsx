import { useId, useState } from 'react'
import { LuPlus } from '../utils/icons'

const FloatingActionButton = ({ actions }) => {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const hasChoices = actions.length > 1
  const singleAction = actions[0]
  const SingleActionIcon = singleAction?.icon || LuPlus

  const handleTriggerClick = () => {
    if (hasChoices) {
      setOpen((isOpen) => !isOpen)
      return
    }

    singleAction?.onClick()
  }

  const handleActionClick = (action) => {
    setOpen(false)
    action.onClick()
  }

  return (
    <div className="floating-action">
      {hasChoices && open && (
        <div id={menuId} className="floating-action-menu" role="menu">
          {actions.map(({ label, icon: Icon = LuPlus, onClick }) => (
            <button
              type="button"
              key={label}
              className="floating-action-option"
              role="menuitem"
              onClick={() => handleActionClick({ label, onClick })}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="floating-action-trigger"
        aria-label={hasChoices ? 'Quick add' : singleAction?.label}
        aria-expanded={hasChoices ? open : undefined}
        aria-haspopup={hasChoices ? 'menu' : undefined}
        aria-controls={hasChoices ? menuId : undefined}
        onClick={handleTriggerClick}
      >
        {hasChoices ? (
          <LuPlus aria-hidden="true" />
        ) : (
          <SingleActionIcon aria-hidden="true" />
        )}
        <span>{hasChoices ? 'Quick add' : singleAction?.label}</span>
      </button>
    </div>
  )
}

export default FloatingActionButton
