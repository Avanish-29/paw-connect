import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, userApi } from '../api/authApi.js'
import { getStoredToken, storeToken } from '../api/axiosClient.js'

const AuthContext = createContext(null)
const USER_KEY = 'pap_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    userApi
      .me()
      .then((profile) => {
        setUser(profile)
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
      })
      .catch(() => {
        storeToken(null)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      async login(payload) {
        const data = await authApi.login(payload)
        storeToken(data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return data.user
      },
      async register(payload) {
        const data = await authApi.register(payload)
        storeToken(data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return data.user
      },
      async updateProfile(payload) {
        const profile = await userApi.updateMe(payload)
        setUser(profile)
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
        return profile
      },
      logout() {
        storeToken(null)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      },
    }),
    [token, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
