import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LuChevronDown, LuLogOut } from '../utils/icons'
import { UserContext } from '../../features/auth/context/UserContextValue'
import CharAvatar from '../ui/cards/CharAvatar'
import Logo from '../assets/Budgee.png'
import ThemeControls from '../../features/theme/components/ThemeControls'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'

const Navbar = () => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!profileMenuOpen) return

    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [profileMenuOpen])

  const handleLogout = () => {
    // Clear the httpOnly refresh cookie server-side; fire-and-forget.
    axiosInstance.post(API_PATHS.AUTH.LOGOUT).catch(() => {})
    localStorage.removeItem('token')
    clearUser()
    setProfileMenuOpen(false)
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <header className="app-navbar sticky top-0 z-30 flex h-[68px] items-center gap-3 px-4 sm:px-7">
      <img src={Logo} alt="" className="h-9 w-9 object-contain" />
      <div>
        <h2 className="text-base font-bold tracking-tight text-black sm:text-lg">
          Budgee
        </h2>
        <p className="hidden text-[11px] text-gray-500 sm:block">
          Your money, in balance.
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeControls compact />
        {user && (
          <div className="profile-menu" ref={profileMenuRef}>
            <button
              type="button"
              className="profile-menu-trigger"
              aria-label="Open profile menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
            >
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <CharAvatar
                  fullName={user.fullName || ''}
                  width="h-10 w-10"
                  height="h-10"
                  style="text-sm font-bold"
                />
              )}
              <LuChevronDown
                className={`profile-menu-chevron ${profileMenuOpen ? 'is-open' : ''}`}
                aria-hidden="true"
              />
            </button>

            {profileMenuOpen && (
              <div className="profile-menu-popover" role="menu">
                <div className="profile-menu-identity">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user.fullName}
                  </p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  type="button"
                  className="profile-menu-logout"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LuLogOut aria-hidden="true" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
