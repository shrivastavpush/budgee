import React from 'react'
import { Link } from 'react-router-dom'
import { LuTrendingUpDown } from '../../utils/icons'
import LOGO from '../../assets/Budgee.png'
import CustomAutBarChart from '../Charts/CustomAutBarChart'
import InfoCard from '../Cards/InfoCard'
import ThemeControls from '../ThemeControls'

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-shell grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="auth-main relative flex flex-col px-6 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2.5">
            <img src={LOGO} alt="" className="h-10 w-10 object-contain" />
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Budgee
            </span>
          </Link>
          <ThemeControls compact />
        </div>

        <div className="auth-form-stack mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center py-10">
          <div className="auth-intro mb-8">
            <p className="mb-2 text-sm font-semibold text-teal-600">
              Your finances, made clearer
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Make room for what matters.
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              A calmer way to keep up with your spending, savings, and the
              everyday choices in between.
            </p>
          </div>
          {children}
        </div>
        <p className="auth-footnote text-center text-xs text-gray-500">
          Your money story stays yours.
        </p>
      </section>

      <section className="auth-panel relative hidden overflow-hidden p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full border border-white/10" />
        <div className="relative z-10 max-w-md pt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
            Money, with perspective
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Small steps add up to something big.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-white/75">
            See the full picture, celebrate your progress, and feel more
            confident about what comes next.
          </p>
        </div>

        <div className="relative z-10 mt-6 space-y-4">
          <InfoCard
            icon={<LuTrendingUpDown />}
            label="Your money, at a glance"
            value="100,000"
            color="bg-emerald-500"
          />
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white p-3 shadow-2xl shadow-black/10">
            <CustomAutBarChart />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AuthLayout
