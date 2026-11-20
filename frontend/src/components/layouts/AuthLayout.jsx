import React from 'react'
import { Link } from 'react-router-dom'
import { LuArrowRight, LuShieldCheck, LuTrendingUp } from '../../utils/icons'
import LOGO from '../../assets/Budgee.png'
import ThemeControls from '../ThemeControls'

const AuthLayout = ({ children }) => {
  return (
    <div className="grid min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] lg:grid-cols-2">
      <section className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={LOGO} alt="" className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold tracking-tight">Budgee</span>
          </Link>
          <ThemeControls compact />
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8">
            {children}
          </div>
          <Link
            to="/"
            className="mt-5 text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            ← Back to home
          </Link>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-[var(--accent)] p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/15" />
        <div className="relative max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            Money, with perspective
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Small steps add up to something big.
          </h2>
          <ul className="mt-8 space-y-4 text-white/90">
            <li className="flex items-center gap-3">
              <LuTrendingUp className="text-xl" /> Track income and expenses
            </li>
            <li className="flex items-center gap-3">
              <LuArrowRight className="text-xl" /> Spot patterns with clear charts
            </li>
            <li className="flex items-center gap-3">
              <LuShieldCheck className="text-xl" /> Secure sessions, exportable data
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default AuthLayout
