import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const MODES = ['light', 'dark', 'system']
const ACCENTS = [
  'emerald',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'rose',
  'orange',
  'amber',
  'slate',
]
const DARK_STYLES = ['soft', 'midnight']

const KEYS = {
  mode: 'budgee-theme-mode',
  accent: 'budgee-theme-accent',
  darkStyle: 'budgee-theme-dark-style',
}

const THEME_COLORS = { light: '#f5f7f5', dark: '#111513', midnight: '#000000' }

const read = (key, valid, fallback) => {
  const value = localStorage.getItem(key)
  return valid.includes(value) ? value : fallback
}

const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

const resolve = (mode) =>
  mode === 'system' ? (systemQuery().matches ? 'dark' : 'light') : mode

const applyToDom = (mode, accent, darkStyle) => {
  const root = document.documentElement
  const theme = resolve(mode)
  root.dataset.theme = theme
  root.dataset.accent = accent
  root.dataset.darkStyle = darkStyle
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      'content',
      theme === 'dark'
        ? THEME_COLORS[darkStyle === 'midnight' ? 'midnight' : 'dark']
        : THEME_COLORS.light
    )
}

export const ThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState(() => read(KEYS.mode, MODES, 'system'))
  const [accent, setAccent] = useState(() =>
    read(KEYS.accent, ACCENTS, 'emerald')
  )
  const [darkStyle, setDarkStyle] = useState(() =>
    read(KEYS.darkStyle, DARK_STYLES, 'soft')
  )
  const [systemDark, setSystemDark] = useState(() => systemQuery().matches)

  const resolvedMode =
    mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  // Follow OS changes
  useEffect(() => {
    const q = systemQuery()
    const onChange = () => setSystemDark(q.matches)
    q.addEventListener('change', onChange)
    return () => q.removeEventListener('change', onChange)
  }, [])

  // Apply + persist
  useEffect(() => {
    applyToDom(mode, accent, darkStyle)
    localStorage.setItem(KEYS.mode, mode)
    localStorage.setItem(KEYS.accent, accent)
    localStorage.setItem(KEYS.darkStyle, darkStyle)
  }, [mode, accent, darkStyle, systemDark])

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEYS.mode) setModeState(read(KEYS.mode, MODES, 'system'))
      if (e.key === KEYS.accent)
        setAccent(read(KEYS.accent, ACCENTS, 'emerald'))
      if (e.key === KEYS.darkStyle)
        setDarkStyle(read(KEYS.darkStyle, DARK_STYLES, 'soft'))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Mode change with a circular reveal from the click point (View Transitions API).
  const setMode = useCallback(
    (next, origin) => {
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
      if (!document.startViewTransition || reduce || next === mode) {
        setModeState(next)
        return
      }
      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? 0
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
      const transition = document.startViewTransition(() => {
        // Apply synchronously so the "after" snapshot is the new theme.
        applyToDom(next, accent, darkStyle)
        setModeState(next)
      })
      transition.ready
        .then(() =>
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 550,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        )
        .catch(() => {})
    },
    [mode, accent, darkStyle]
  )

  const value = useMemo(
    () => ({
      mode,
      setMode,
      resolvedMode,
      accent,
      setAccent,
      darkStyle,
      setDarkStyle,
    }),
    [mode, setMode, resolvedMode, accent, darkStyle]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
