import { useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const validModes = ['light', 'dark', 'system']
const validAccents = ['emerald', 'blue', 'violet', 'rose', 'amber']

const getPreference = (key, validValues, fallback) => {
  const value = localStorage.getItem(key)
  return validValues.includes(value) ? value : fallback
}

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() =>
    getPreference('budgee-theme-mode', validModes, 'system')
  )
  const [accent, setAccent] = useState(() =>
    getPreference('budgee-theme-accent', validAccents, 'emerald')
  )

  useEffect(() => {
    const root = document.documentElement
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      root.dataset.theme =
        mode === 'system' ? (systemTheme.matches ? 'dark' : 'light') : mode
      root.dataset.accent = accent
      localStorage.setItem('budgee-theme-mode', mode)
      localStorage.setItem('budgee-theme-accent', accent)
    }

    applyTheme()

    if (mode === 'system') {
      systemTheme.addEventListener('change', applyTheme)
      return () => systemTheme.removeEventListener('change', applyTheme)
    }
  }, [mode, accent])

  return (
    <ThemeContext.Provider value={{ mode, setMode, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}
