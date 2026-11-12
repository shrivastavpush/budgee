import React, { useCallback, useMemo, useState } from 'react'
import { UserContext } from './UserContextValue'

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const updateUser = useCallback((userData) => {
    setUser(userData)
  }, [])

  const clearUser = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, updateUser, clearUser }),
    [user, updateUser, clearUser]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider
