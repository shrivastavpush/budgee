import React from 'react'
import CARD_2 from '../../assets/images/banner-img.jpg'
import { LuTrendingUpDown } from 'react-icons/lu'

const AuthLayout = ({ children }) => {
    return (
        <div className='flex items-center justify-between'>
            <div className='w-screen h-screen md:w-[60vw] px-12 pb-12'>
                <h2 className='text-lg font-medium text-black'>Budgee - Your Expense Manager Buddy</h2>
                {children}
            </div>

            <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
                <div className='w-48 h-48 absolute rounded-[40px] bg-orange-200 -top-7 -left-5' />
                <div className='w-48 h-56 absolute rounded-[40px] border-orange-500 border-[20px] top-[30%] -right-10' />
                <div className='w-48 h-48 absolute rounded-[40px] bg-yellow-500 -bottom-7 -left-5' />

                <div className="grid grid-cols-1z-20">
                    <StatusInfoCard icon={<LuTrendingUpDown />} label="Track Your Income & Expenses"
                        value="100,000"
                        color="bg-primary" />
                </div>

                <img src={CARD_2} alt="" className='w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15 rounded-2xl' />
            </div>
        </div>
    )
}

export default AuthLayout

const StatusInfoCard = ({ icon, label, value, color }) => {
    return <div className='flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-1'>
        <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>{icon}
        </div>
        <div className=''>
            <h6 className=''>{label}</h6>
            <span>${value}</span>
        </div>
    </div>
}