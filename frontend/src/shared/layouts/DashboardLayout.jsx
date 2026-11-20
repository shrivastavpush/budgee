import React, { useContext } from 'react'
import { UserContext } from '../../features/auth/context/UserContextValue'
import Navbar from './Navbar'
import DashboardDock from './DashboardDock'

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext)

  return (
    <div className="min-h-screen">
      <Navbar />

      {user && (
        <div className="min-h-[calc(100vh-4.25rem)]">
          <main className="app-content min-w-0 px-4 py-6 pb-32 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1440px]">{children}</div>
          </main>
          <DashboardDock activeMenu={activeMenu} />
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
