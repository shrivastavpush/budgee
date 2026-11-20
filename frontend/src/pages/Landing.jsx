import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LuArrowRight,
  LuCalendarDays,
  LuChartPie,
  LuDownload,
  LuHandCoins,
  LuShieldCheck,
  LuTrendingDown,
  LuTrendingUp,
  LuWalletMinimal,
  HiOutlineMenu,
  HiOutlineX,
} from '../utils/icons'
import Logo from '../assets/Budgee.png'
import ThemeControls from '../components/ThemeControls'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#privacy', label: 'Privacy' },
]

const features = [
  {
    icon: LuWalletMinimal,
    title: 'Track every expense',
    text: 'Log spending with categories and emoji in seconds. See where it all goes.',
  },
  {
    icon: LuHandCoins,
    title: 'Know your income',
    text: 'Record every source of income and watch your 60-day trend grow.',
  },
  {
    icon: LuChartPie,
    title: 'Clear visual insights',
    text: 'Charts and a live balance overview turn raw numbers into decisions.',
  },
  {
    icon: LuCalendarDays,
    title: 'Daily overview',
    text: 'Zoom into any day and compare income against expenses at a glance.',
  },
  {
    icon: LuDownload,
    title: 'Export anytime',
    text: 'Download your data for any date range. Your records, your control.',
  },
  {
    icon: LuShieldCheck,
    title: 'Secure by design',
    text: 'Short-lived tokens and hardened APIs keep your account protected.',
  },
]

const steps = [
  { title: 'Create your account', text: 'Sign up free in under a minute.' },
  { title: 'Add income & expenses', text: 'Log transactions as they happen.' },
  {
    title: 'See the full picture',
    text: 'Use insights to save with confidence.',
  },
]

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_22%,transparent)] transition-colors hover:bg-[var(--accent-strong)]'
const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-muted)]'

const PreviewCard = () => (
  <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-[var(--text-secondary)]">
        Total balance
      </p>
      <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
        This month
      </span>
    </div>
    <p className="mt-2 text-4xl font-bold tracking-tight">₹84,250</p>

    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-[var(--income-soft)] p-4">
        <LuTrendingUp className="text-[var(--income-color)]" />
        <p className="mt-2 text-xs text-[var(--text-secondary)]">Income</p>
        <p className="font-bold text-[var(--income-color)]">₹1,20,000</p>
      </div>
      <div className="rounded-2xl bg-[var(--expense-soft)] p-4">
        <LuTrendingDown className="text-[var(--expense-color)]" />
        <p className="mt-2 text-xs text-[var(--text-secondary)]">Expenses</p>
        <p className="font-bold text-[var(--expense-color)]">₹35,750</p>
      </div>
    </div>

    <div className="mt-5 flex h-24 items-end gap-2">
      {[40, 65, 50, 80, 55, 90, 70, 100].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-lg bg-[var(--accent)]"
          style={{ height: `${h}%`, opacity: 0.35 + h / 160 }}
        />
      ))}
    </div>
  </div>
)

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--page-bg)_85%,transparent)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={Logo} alt="" className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold tracking-tight">Budgee</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeControls compact />
            <Link
              to="/login"
              className={`${btnGhost} hidden !py-2 sm:inline-flex`}
            >
              Sign in
            </Link>
            <Link to="/signup" className={`${btnPrimary} !py-2`}>
              Sign up
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-xl md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-[var(--border)] px-4 py-3 md:hidden">
            {[...navLinks, { href: '/login', label: 'Sign in' }].map((l) =>
              l.href.startsWith('/') ? (
                <Link
                  key={l.href}
                  to={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--surface-muted)]"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--surface-muted)]"
                >
                  {l.label}
                </a>
              )
            )}
          </nav>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.08] blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="inline-block rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                Personal finance, simplified
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Your money,{' '}
                <span className="text-[var(--accent)]">in balance.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                Budgee helps you track income and expenses, spot patterns, and
                feel confident about every rupee — all in one calm dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/signup" className={`${btnPrimary} !px-6 !py-3`}>
                  Get started free <LuArrowRight />
                </Link>
                <Link to="/login" className={`${btnGhost} !px-6 !py-3`}>
                  Sign in
                </Link>
              </div>
            </div>
            <PreviewCard />
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-[var(--accent)]">
              Features
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need, nothing you don’t.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] transition-transform hover:-translate-y-1"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-xl text-[var(--accent)]">
                  <Icon />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="scroll-mt-20 bg-[var(--surface-muted)] py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Up and running in three steps
            </h2>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="rounded-2xl bg-[var(--surface)] p-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Privacy + CTA */}
        <section
          id="privacy"
          className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6"
        >
          <div className="rounded-3xl bg-[var(--accent)] px-6 py-14 text-center text-white sm:px-12">
            <LuShieldCheck className="mx-auto text-4xl opacity-90" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Your money story stays yours.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Secure sessions, exportable data, and no clutter. Start budgeting
              with clarity today.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--accent-strong)] transition-opacity hover:opacity-90"
            >
              Create your free account <LuArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-[var(--text-subtle)] sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="" className="h-6 w-6 object-contain" />
            <span className="font-semibold text-[var(--text-secondary)]">
              Budgee
            </span>
          </div>
          <p>© {new Date().getFullYear()} Budgee. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
