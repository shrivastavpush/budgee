import React from 'react'
import CARD_2 from '../../assets/images/banner-img.jpg'
import { LuTrendingUpDown } from '../../utils/icons'
import LOGO from '../../assets/Budgee.png'
import CustomAutBarChart from '../Charts/CustomAutBarChart'
import InfoCard from '../Cards/InfoCard'

const AuthLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="w-screen h-screen md:w-[50vw] p-12 flex flex-col justify-between">
        <div className="flex items-center gap-2 flex-col text-center">
          <img src={LOGO} alt="Budgee Logo" className="w-40 h-40" />
          <h2 className="text-3xl font-semibold text-black">Budgee</h2>
          <p className="text-xl text-gray-700 font-bold">
            Your Expense Manager Buddy
          </p>
        </div>
        {children}
      </div>

      <div className="hidden md:block w-[50vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 absolute rounded-[40px] bg-emerald-200 -top-7 -left-5" />
        <div className="w-48 h-56 absolute rounded-[40px] border-teal-500 border-[20px] top-[30%] -right-10" />
        <div className="w-48 h-48 absolute rounded-[40px] bg-emerald-200 -bottom-7 -left-5" />

        <div className="grid grid-cols-1z-20">
          <InfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="100,000"
            color="bg-emerald-500"
          />
        </div>

        <div className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15 rounded-2xl">
          <CustomAutBarChart />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
