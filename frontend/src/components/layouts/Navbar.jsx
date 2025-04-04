import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import SideMenu from './SideMenu'
import Logo from '../../assets/Budgee.svg'

const Navbar = ({ activeMenu }) => {

    const [openSideMenu, setOpenSideMenu] = useState(false)
    return (
        <div className='flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 items-center md:shadow-md shadow-sm'>
            <button
                className='block lg:hidden text-black cursor-pointer'
                onClick={() => setOpenSideMenu(!openSideMenu)}>{openSideMenu
                    ? (
                        <HiOutlineX className='text-2xl' />
                    ) : (
                        <HiOutlineMenu className='text-2xl' />
                    )
                }
            </button>

            <img src={Logo} alt="logo" className='w-10 h-10' />

            <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>

            {openSideMenu && (
                <div className='fixed top-[75px] -ml-7 bg-white h-screen shadow-lg'>
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </div>
    )
}

export default Navbar
