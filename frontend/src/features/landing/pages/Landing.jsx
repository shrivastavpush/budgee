import { useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
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
  FaGithub,
  HiOutlineMenu,
  HiOutlineX,
} from '../../../shared/utils/icons'
import Logo from '../../../shared/assets/Budgee.png'
import ThemeControls from '../../theme/components/ThemeControls'
import AuthModal from '../../auth/components/AuthModal'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, useGSAP)

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
    span: 'lg:col-span-2',
  },
  {
    icon: LuHandCoins,
    title: 'Know your income',
    text: 'Record every source and watch your 60-day trend grow.',
  },
  {
    icon: LuChartPie,
    title: 'Visual insights',
    text: 'Charts and a live balance overview turn numbers into decisions.',
  },
  {
    icon: LuCalendarDays,
    title: 'Daily overview',
    text: 'Zoom into any day and compare income against expenses.',
  },
  {
    icon: LuDownload,
    title: 'Export anytime',
    text: 'Download your data for any date range. Your records, your control.',
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

const stats = [
  { value: 60, suffix: ' days', label: 'income trend tracked' },
  { value: 30, suffix: ' days', label: 'expense insights' },
  { value: 100, suffix: '%', label: 'exportable data' },
  { value: 0, prefix: '₹', label: 'cost to start' },
]

const ticker = [
  '🍔 Food',
  '🏠 Rent',
  '🚗 Travel',
  '💼 Salary',
  '🛒 Groceries',
  '🎬 Entertainment',
  '💡 Bills',
  '📈 Investments',
  '🎁 Gifts',
  '🩺 Health',
]

const bars = [40, 65, 50, 80, 55, 90, 70, 100]

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_30%,transparent)] transition-colors hover:bg-[var(--accent-strong)]'
const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-muted)]'

const PreviewCard = () => (
  <div data-tilt-wrap className="relative [perspective:1200px]">
    <div
      data-float
      className="absolute -left-6 top-10 z-10 hidden items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-[var(--card-shadow)] sm:flex"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--income-soft)] text-[var(--income-color)]">
        <LuTrendingUp />
      </span>
      <div>
        <p className="text-[11px] text-[var(--text-secondary)]">Salary</p>
        <p className="text-sm font-bold text-[var(--income-color)]">
          +₹1,20,000
        </p>
      </div>
    </div>
    <div
      data-float
      className="absolute -right-4 bottom-8 z-10 hidden items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-[var(--card-shadow)] sm:flex"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--expense-soft)] text-[var(--expense-color)]">
        <LuTrendingDown />
      </span>
      <div>
        <p className="text-[11px] text-[var(--text-secondary)]">Groceries</p>
        <p className="text-sm font-bold text-[var(--expense-color)]">-₹2,450</p>
      </div>
    </div>

    <div
      data-tilt
      className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_30px_80px_color-mix(in_srgb,var(--accent)_18%,transparent)] [transform-style:preserve-3d]"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-secondary)]">
          Total balance
        </p>
        <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
          This month
        </span>
      </div>
      <p className="mt-2 text-4xl font-bold tracking-tight">
        ₹<span data-count>0</span>
      </p>

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

      <div className="mt-6 flex h-28 items-end gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            data-bar={h}
            className="flex-1 origin-bottom rounded-t-lg bg-[var(--accent)]"
            style={{ height: `${h}%`, opacity: 0.35 + h / 160 }}
          />
        ))}
      </div>
    </div>
  </div>
)

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const root = useRef(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const authMode =
    pathname === '/login' ? 'login' : pathname === '/signup' ? 'signup' : null

  const scrollTo = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    gsap.to(window, {
      duration: 1,
      ease: 'power3.inOut',
      scrollTo: { y: href, offsetY: 90 },
    })
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ---- Hero intro: split headline into words ----
        const split = SplitText.create('[data-split]', {
          type: 'words',
          mask: 'words',
        })
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('[data-nav]', { y: -40, opacity: 0, duration: 0.7 })
          .from('[data-badge]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
          .from(
            split.words,
            { yPercent: 110, duration: 0.9, stagger: 0.08, ease: 'expo.out' },
            '-=0.3'
          )
          .from(
            '[data-hero-sub] > *',
            { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 },
            '-=0.5'
          )
          .from(
            '[data-tilt]',
            { y: 80, opacity: 0, scale: 0.92, duration: 1.1 },
            '-=1'
          )
          .from(
            '[data-bar]',
            {
              scaleY: 0,
              duration: 0.8,
              stagger: 0.06,
              ease: 'elastic.out(1,0.7)',
            },
            '-=0.6'
          )
          .from(
            '[data-float]',
            {
              scale: 0,
              opacity: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: 'back.out(2.5)',
            },
            '-=0.5'
          )

        // Balance count-up
        const bal = { v: 0 }
        const balEl = root.current.querySelector('[data-count]')
        gsap.to(bal, {
          v: 84250,
          duration: 2,
          delay: 0.9,
          ease: 'power2.out',
          onUpdate: () => {
            balEl.textContent = Math.round(bal.v).toLocaleString('en-IN')
          },
        })

        // Chart bars breathe
        gsap.utils.toArray('[data-bar]').forEach((bar, i) => {
          gsap.to(bar, {
            scaleY: gsap.utils.random(0.6, 1),
            duration: gsap.utils.random(1.4, 2.4),
            delay: 2.5 + i * 0.1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        })

        // Floating chips
        gsap.utils.toArray('[data-float]').forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 ? 14 : -14,
            rotation: i % 2 ? 2 : -2,
            duration: 2.6 + i * 0.5,
            delay: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        })

        // ---- Mouse tilt on hero card ----
        const wrap = root.current.querySelector('[data-tilt-wrap]')
        const card = root.current.querySelector('[data-tilt]')
        const rx = gsap.quickTo(card, 'rotationX', {
          duration: 0.6,
          ease: 'power3',
        })
        const ry = gsap.quickTo(card, 'rotationY', {
          duration: 0.6,
          ease: 'power3',
        })
        const onMove = (e) => {
          const r = wrap.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 14)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 14)
        }
        const onLeave = () => {
          rx(0)
          ry(0)
        }
        wrap.addEventListener('pointermove', onMove)
        wrap.addEventListener('pointerleave', onLeave)

        // ---- Magnetic buttons ----
        const magnets = gsap.utils.toArray('[data-magnetic]').map((el) => {
          const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
          const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
          const move = (e) => {
            const r = el.getBoundingClientRect()
            mx((e.clientX - (r.left + r.width / 2)) * 0.3)
            my((e.clientY - (r.top + r.height / 2)) * 0.3)
          }
          const leave = () => {
            mx(0)
            my(0)
          }
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          return () => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          }
        })

        // ---- Spotlight on feature cards ----
        const spots = gsap.utils.toArray('[data-spot]').map((el) => {
          const move = (e) => {
            const r = el.getBoundingClientRect()
            el.style.setProperty('--mx', `${e.clientX - r.left}px`)
            el.style.setProperty('--my', `${e.clientY - r.top}px`)
          }
          el.addEventListener('pointermove', move)
          return () => el.removeEventListener('pointermove', move)
        })

        // ---- Scroll: progress bar, parallax, nav shadow ----
        gsap.to('[data-progress]', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { scrub: 0.3, start: 0, end: 'max' },
        })
        const hero = {
          trigger: '[data-hero-section]',
          scrub: true,
          start: 'top top',
          end: 'bottom top',
        }
        gsap.to('[data-tilt-wrap]', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: hero,
        })
        gsap.to('[data-blob]', {
          yPercent: 40,
          ease: 'none',
          scrollTrigger: hero,
        })

        // ---- Ticker marquee ----
        const marquee = gsap.to('[data-marquee]', {
          xPercent: -50,
          duration: 30,
          ease: 'none',
          repeat: -1,
        })
        const ticker = root.current.querySelector('[data-ticker]')
        const slow = () => gsap.to(marquee, { timeScale: 0.2, duration: 0.5 })
        const fast = () => gsap.to(marquee, { timeScale: 1, duration: 0.5 })
        ticker.addEventListener('pointerenter', slow)
        ticker.addEventListener('pointerleave', fast)

        // ---- Section reveals ----
        gsap.utils.toArray('[data-reveal]').forEach((group) => {
          gsap.from(group.querySelectorAll('[data-item]'), {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          })
        })

        // ---- Stats count-up ----
        gsap.utils.toArray('[data-stat]').forEach((el) => {
          const end = Number(el.dataset.stat)
          const obj = { v: 0 }
          gsap.to(obj, {
            v: end,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onUpdate: () => (el.textContent = Math.round(obj.v)),
          })
        })

        // ---- Steps: scrubbed connector line + number pop ----
        gsap.fromTo(
          '[data-line]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-steps]',
              start: 'top 70%',
              end: 'bottom 55%',
              scrub: true,
            },
          }
        )
        gsap.utils.toArray('[data-step-num]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0.2, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              ease: 'back.out(2)',
              duration: 0.6,
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        })

        // ---- CTA ring parallax ----
        gsap.to('[data-ring]', {
          rotation: 90,
          ease: 'none',
          scrollTrigger: { trigger: '[data-cta]', scrub: true },
        })

        return () => {
          wrap.removeEventListener('pointermove', onMove)
          wrap.removeEventListener('pointerleave', onLeave)
          ticker.removeEventListener('pointerenter', slow)
          ticker.removeEventListener('pointerleave', fast)
          magnets.forEach((off) => off())
          spots.forEach((off) => off())
        }
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div
      ref={root}
      className="min-h-screen overflow-x-hidden bg-[var(--page-bg)] text-[var(--text-primary)]"
    >
      <div
        data-progress
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-[var(--accent)]"
      />

      {/* Navbar */}
      <header
        data-nav
        className="sticky top-3 z-40 mx-auto mt-3 max-w-6xl px-3 sm:px-4"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] shadow-[var(--card-shadow)] backdrop-blur-xl">
          <div className="flex h-14 items-center gap-6 px-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={Logo} alt="" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold tracking-tight">Budgee</span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => scrollTo(e, l.href)}
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
            <nav className="flex flex-col gap-1 border-t border-[var(--border)] p-3 md:hidden">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => scrollTo(e, l.href)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--surface-muted)]"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--surface-muted)]"
              >
                Sign in
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main>
        {/* Hero */}
        <section data-hero-section className="relative">
          <div
            data-blob
            className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent),transparent)] opacity-20 blur-2xl"
          />
          <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
            <div>
              <span
                data-badge
                className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
                Personal finance, simplified
              </span>
              <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                <span data-split className="block">
                  Your money,
                </span>
                <span data-split className="block text-[var(--accent)]">
                  in balance.
                </span>
              </h1>
              <div data-hero-sub>
                <p className="mt-6 max-w-lg text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                  Track income and expenses, spot patterns, and feel confident
                  about every rupee — all in one calm dashboard.
                </p>
                <div className="flex flex-wrap gap-3 pt-8">
                  <Link
                    to="/signup"
                    data-magnetic
                    className={`${btnPrimary} !px-6 !py-3`}
                  >
                    Get started free <LuArrowRight />
                  </Link>
                  <Link
                    to="/login"
                    data-magnetic
                    className={`${btnGhost} !px-6 !py-3`}
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
            <PreviewCard />
          </div>
        </section>

        {/* Category ticker */}
        <div
          data-ticker
          className="overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        >
          <div data-marquee className="flex w-max gap-4">
            {[...ticker, ...ticker].map((t, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <section data-reveal className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                data-item
                className="bg-[var(--surface)] px-6 py-8 text-center"
              >
                <p className="text-3xl font-bold tracking-tight text-[var(--accent)] sm:text-4xl">
                  {s.prefix}
                  <span data-stat={s.value}>0</span>
                  {s.suffix}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features (bento) */}
        <section
          id="features"
          data-reveal
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6"
        >
          <div data-item className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-[var(--accent)]">
              Features
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
              Everything you need, nothing you don’t.
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text, span }) => (
              <div
                key={title}
                data-item
                data-spot
                className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-colors duration-300 hover:border-[var(--accent-border)] ${span || ''}`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),color-mix(in_srgb,var(--accent)_16%,transparent),transparent_70%)] group-hover:opacity-100" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-2xl text-[var(--accent)] transition duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[var(--accent)] group-hover:text-white">
                  <Icon />
                </span>
                <h3 className="relative mt-5 text-lg font-semibold">{title}</h3>
                <p className="relative mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                  {text}
                </p>
              </div>
            ))}
            <div
              data-item
              className="flex flex-col justify-between rounded-3xl bg-[var(--accent)] p-7 text-white"
            >
              <LuShieldCheck className="text-3xl" />
              <div className="mt-8">
                <h3 className="text-lg font-semibold">Secure by design</h3>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Short-lived tokens and hardened APIs protect your account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          data-reveal
          className="scroll-mt-24 bg-[var(--surface-muted)] py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2
              data-item
              className="text-center text-3xl font-bold tracking-tight sm:text-5xl"
            >
              Up and running in three steps
            </h2>
            <div data-steps className="relative mt-14">
              <div className="absolute left-[16%] right-[16%] top-[3.1rem] hidden h-0.5 bg-[var(--border)] md:block">
                <div
                  data-line
                  className="h-full origin-left bg-[var(--accent)]"
                />
              </div>
              <ol className="relative grid gap-6 md:grid-cols-3">
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    data-item
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center"
                  >
                    <span
                      data-step-num
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-xl font-bold text-white shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                      {s.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="privacy"
          data-reveal
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6"
        >
          <div
            data-item
            data-cta
            className="relative overflow-hidden rounded-[2rem] bg-[var(--accent)] px-6 py-16 text-center text-white sm:px-12"
          >
            <div
              data-ring
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-2 border-dashed border-white/25"
            />
            <div
              data-ring
              className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border-2 border-dashed border-white/25"
            />
            <h2 className="relative text-3xl font-bold tracking-tight sm:text-5xl">
              Your money story stays yours.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/80">
              Secure sessions, exportable data, and no clutter. Start budgeting
              with clarity today.
            </p>
            <Link
              to="/signup"
              data-magnetic
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--accent-strong)]"
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
          <a
            href="https://github.com/shrivastavpush/budgee"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
          >
            <FaGithub className="text-lg transition-transform group-hover:rotate-12" />
            Like this project? Star on GitHub
          </a>
          <p>© {new Date().getFullYear()} Budgee. All rights reserved.</p>
        </div>
      </footer>

      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={(m) => navigate(`/${m}`, { replace: true })}
          onClose={() => navigate('/', { replace: true })}
        />
      )}
      <Outlet />
    </div>
  )
}

export default Landing
