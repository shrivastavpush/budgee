import React, { useContext } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import CharAvatar from '../Cards/CharAvatar'
import { toast } from 'react-hot-toast'

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout()
            toast.success("Logged out successfully")
            return
        }
        navigate(route)
    }

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        navigate('/login')
    }

    return (
        <div className='w-full h-full bg-white p-6 flex flex-col rounded-r-2xl md:rounded-2xl shadow-md'>
            <div className='flex flex-col items-center justify-center gap-3 mb-8'>
                <div className='relative group'>
                    {user?.profileImageUrl ? (
                        <img
                            src={user?.profileImageUrl}
                            alt="Profile Image"
                            className='w-20 h-20 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-teal-500 transition-all duration-300'
                        />
                    ) : (
                        <CharAvatar
                            fullName={user?.fullName || ""}
                            width="w-20"
                            height="h-20"
                            style="text-xl"
                            className="ring-2 ring-gray-200 group-hover:ring-teal-500 transition-all duration-300"
                        />
                    )}
                    <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full border-2 border-white'></div>
                </div>

                <div className='text-center'>
                    <h5 className='text-gray-900 font-semibold leading-6'>
                        {user?.fullName || ""}
                    </h5>
                    <p className='text-sm text-gray-500 mt-1'>
                        {user?.email || ""}
                    </p>
                </div>
            </div>

            <div className='flex-1 flex flex-col gap-2'>
                {SIDE_MENU_DATA.map((item, index) => (
                    <button
                        key={`menu_${index}`}
                        className={`w-full flex items-center gap-4 text-[15px] cursor-pointer ${activeMenu === item.label
                            ? "text-white bg-teal-500 shadow-md"
                            : "text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                            } py-3 px-6 rounded-md transition-all duration-200`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className={`text-xl ${activeMenu === item.label ? "text-white" : "text-gray-500"}`} />
                        <span className='font-medium'>{item.label}</span>
                    </button>
                ))}
            </div>

            <div className='mt-auto pt-6 border-t border-gray-100'>
                <div className='text-center text-sm text-gray-500'>
                    <p>Made With ❤️ in India</p>
                    <p className='mt-1'>© 2025 All rights reserved</p>
                </div>
            </div>
        </div>
    )
}

export default SideMenu
