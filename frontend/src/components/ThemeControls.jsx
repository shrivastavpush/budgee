import { useState } from 'react'
import { LuMonitor, LuMoon, LuPalette, LuSun } from '../utils/icons'
import { useTheme } from '../context/useTheme'

const modes = [
  { value: 'light', label: 'Light', icon: LuSun },
  { value: 'dark', label: 'Dark', icon: LuMoon },
  { value: 'system', label: 'Automatic', icon: LuMonitor },
]

const accents = [
  { value: 'emerald', label: 'Emerald', color: '#13845b' },
  { value: 'blue', label: 'Ocean blue', color: '#3974d8' },
  { value: 'violet', label: 'Violet', color: '#805ad5' },
  { value: 'rose', label: 'Rose', color: '#d94f70' },
  { value: 'amber', label: 'Amber', color: '#bf780e' },
]

const ThemeControls = ({ compact = false }) => {
  const [open, setOpen] = useState(false)
  const { mode, setMode, accent, setAccent } = useTheme()

  return (
    <div className="theme-control">
      <button
        type="button"
        className="theme-control-trigger"
        aria-label="Appearance settings"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <LuPalette aria-hidden="true" />
        {!compact && <span>Appearance</span>}
      </button>

      {open && (
        <div className="theme-popover" role="dialog" aria-label="Appearance">
          <div className="theme-popover-heading">
            <div>
              <p className="theme-popover-title">Your appearance</p>
              <p className="theme-popover-description">
                Make Budgee feel like yours.
              </p>
            </div>
            <button
              type="button"
              className="theme-popover-close"
              aria-label="Close appearance settings"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <p className="theme-option-label">Theme</p>
          <div className="theme-mode-options">
            {modes.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                className={`theme-mode-option ${mode === value ? 'is-selected' : ''}`}
                aria-pressed={mode === value}
                onClick={() => setMode(value)}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <p className="theme-option-label">Accent color</p>
          <div className="theme-accent-options">
            {accents.map(({ value, label, color }) => (
              <button
                type="button"
                key={value}
                className={`theme-accent-option ${accent === value ? 'is-selected' : ''}`}
                aria-label={`${label} accent`}
                aria-pressed={accent === value}
                title={label}
                onClick={() => setAccent(value)}
              >
                <span style={{ '--swatch-color': color }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeControls
