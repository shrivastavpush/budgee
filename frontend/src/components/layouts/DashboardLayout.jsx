import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext)

    return (
        <>
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden mt-0 md:mt-5 h-[calc(100vh-6rem-15px)]">
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    <div className="grow mx-5 h-[calc(100vh-90px)] overflow-y-auto">
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}

export default DashboardLayout
