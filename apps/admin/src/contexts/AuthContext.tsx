import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../lib/endpoints'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

interface AuthCtx {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const s = localStorage.getItem('admin_user')
    return s ? JSON.parse(s) : null
  })
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('admin_token')
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && !user) {
      authApi.me().then(setUser).catch(logout)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      setToken(data.accessToken)
      setUser(data.user)
      localStorage.setItem('admin_token', data.accessToken)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
