import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LuX } from '../../utils/icons'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

const tabs = [
  { mode: 'login', label: 'Sign in' },
  { mode: 'signup', label: 'Sign up' },
]

// mode: 'login' | 'signup'. Parent owns routing; this only animates + renders.
const AuthModal = ({ mode, onModeChange, onClose }) => {
  const root = useRef(null)
  const overlay = useRef(null)
  const panel = useRef(null)
  const pill = useRef(null)
  const closing = useRef(false)
  const firstRender = useRef(true)

  // Entrance
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(overlay.current, { opacity: 0, duration: 0.3 })
        .from(
          panel.current,
          {
            y: 60,
            scale: 0.92,
            opacity: 0,
            duration: 0.55,
            ease: 'back.out(1.6)',
          },
          '<0.05'
        )
        .from(
          '[data-auth-item]',
          { y: 18, opacity: 0, duration: 0.4, stagger: 0.06 },
          '-=0.25'
        )
    },
    { scope: root }
  )

  // Tab switch: slide pill + re-stagger the form
  useGSAP(
    () => {
      const idx = tabs.findIndex((t) => t.mode === mode)
      gsap.to(pill.current, {
        xPercent: idx * 100,
        duration: 0.4,
        ease: 'power3.inOut',
      })
      if (firstRender.current) {
        firstRender.current = false
        return
      }
      gsap.fromTo(
        '[data-auth-item]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
      )
    },
    { scope: root, dependencies: [mode] }
  )

  const close = () => {
    if (closing.current) return
    closing.current = true
    gsap
      .timeline({ onComplete: onClose })
      .to(panel.current, {
        y: 30,
        scale: 0.95,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      })
      .to(overlay.current, { opacity: 0, duration: 0.2 }, '<')
  }

  // Esc to close + body scroll lock
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Sign in' : 'Sign up'}
    >
      <div
        ref={overlay}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />
      <div
        ref={panel}
        className="relative my-auto w-full max-w-[440px] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
        >
          <LuX />
        </button>

        <div className="relative mb-6 grid w-[calc(100%-2.5rem)] grid-cols-2 rounded-xl bg-[var(--surface-muted)] p-1">
          <div
            ref={pill}
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-[var(--surface)] shadow"
          />
          {tabs.map((t) => (
            <button
              key={t.mode}
              type="button"
              onClick={() => onModeChange(t.mode)}
              className={`relative z-10 py-2 text-sm font-semibold transition-colors ${
                mode === t.mode
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mode === 'login' ? (
          <LoginForm onSwitch={() => onModeChange('signup')} />
        ) : (
          <SignUpForm onSwitch={() => onModeChange('login')} />
        )}
      </div>
    </div>
  )
}

export default AuthModal
