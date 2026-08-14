import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'ktt_seller_session'

const SELLER_ACCOUNT = { username: 'seller', password: '123456' }

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1')

  function login(username, password) {
    const ok = username === SELLER_ACCOUNT.username && password === SELLER_ACCOUNT.password
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setIsAuthenticated(true)
    }
    return ok
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
