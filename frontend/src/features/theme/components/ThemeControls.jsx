import { useEffect, useRef, useState } from 'react'
import {
  LuCheck,
  LuMonitor,
  LuMoon,
  LuPalette,
  LuSun,
} from '../../../shared/utils/icons'
import { useTheme } from '../context/useTheme'

const modes = [
  { value: 'light', label: 'Light', icon: LuSun },
  { value: 'dark', label: 'Dark', icon: LuMoon },
  { value: 'system', label: 'Auto', icon: LuMonitor },
]

const darkStyles = [
  { value: 'soft', label: 'Soft' },
  { value: 'midnight', label: 'Midnight' },
]

const accents = [
  { value: 'emerald', label: 'Emerald', color: '#13845b' },
  { value: 'cyan', label: 'Cyan', color: '#0e8aa6' },
  { value: 'blue', label: 'Ocean blue', color: '#3974d8' },
  { value: 'indigo', label: 'Indigo', color: '#4f46e5' },
  { value: 'violet', label: 'Violet', color: '#805ad5' },
  { value: 'rose', label: 'Rose', color: '#d94f70' },
  { value: 'orange', label: 'Sunset', color: '#c8541c' },
  { value: 'amber', label: 'Amber', color: '#bf780e' },
  { value: 'slate', label: 'Slate', color: '#475569' },
]

const ThemeControls = ({ compact = false }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const {
    mode,
    setMode,
    resolvedMode,
    accent,
    setAccent,
    darkStyle,
    setDarkStyle,
  } = useTheme()

  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const TriggerIcon = resolvedMode === 'dark' ? LuMoon : LuSun

  return (
    <div className="theme-control" ref={ref}>
      <button
        type="button"
        className="theme-control-trigger"
        aria-label="Appearance settings"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <LuPalette aria-hidden="true" className="text-[var(--accent)]" />
        {!compact && <span>Appearance</span>}
      </button>

      {open && (
        <div className="theme-popover" role="dialog" aria-label="Appearance">
          <div className="theme-popover-heading">
            <div>
              <p className="theme-popover-title">Your appearance</p>
              <p className="theme-popover-description">
                <TriggerIcon
                  className="inline -mt-0.5 mr-1"
                  aria-hidden="true"
                />
                Using {resolvedMode} mode
                {mode === 'system' ? ' (from your device)' : ''}
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

          <p className="theme-option-label" id="theme-mode-label">
            Theme
          </p>
          <div
            className="theme-mode-options"
            role="radiogroup"
            aria-labelledby="theme-mode-label"
          >
            {modes.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                role="radio"
                aria-checked={mode === value}
                className={`theme-mode-option ${mode === value ? 'is-selected' : ''}`}
                onClick={(e) => setMode(value, { x: e.clientX, y: e.clientY })}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {resolvedMode === 'dark' && (
            <>
              <p className="theme-option-label" id="theme-dark-label">
                Dark style
              </p>
              <div
                className="theme-dark-options"
                role="radiogroup"
                aria-labelledby="theme-dark-label"
              >
                {darkStyles.map(({ value, label }) => (
                  <button
                    type="button"
                    key={value}
                    role="radio"
                    aria-checked={darkStyle === value}
                    className={`theme-mode-option ${darkStyle === value ? 'is-selected' : ''}`}
                    onClick={() => setDarkStyle(value)}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <p className="theme-option-label" id="theme-accent-label">
            Accent color
          </p>
          <div
            className="theme-accent-options"
            role="radiogroup"
            aria-labelledby="theme-accent-label"
          >
            {accents.map(({ value, label, color }) => (
              <button
                type="button"
                key={value}
                role="radio"
                aria-checked={accent === value}
                className={`theme-accent-option ${accent === value ? 'is-selected' : ''}`}
                aria-label={label}
                title={label}
                onClick={() => setAccent(value)}
              >
                <span
                  className="theme-accent-swatch"
                  style={{ '--swatch-color': color }}
                >
                  {accent === value && <LuCheck aria-hidden="true" />}
                </span>
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeControls
