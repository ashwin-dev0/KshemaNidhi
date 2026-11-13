import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ApiError, apiClient } from '../../services/api/apiClient'
const AuthContext = createContext<{
  signedIn: boolean; checking: boolean; error: string
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>; checkSession: () => Promise<void>
} | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  async function checkSession() {
    setChecking(true)
    setError('')
    try { await apiClient.get('/auth/me'); setSignedIn(true) }
    catch (error) {
      setSignedIn(false)
      if (!(error instanceof ApiError && error.status === 401)) setError(error instanceof Error ? error.message : 'Cannot connect to the server.')
    } finally { setChecking(false) }
  }
  useEffect(() => {
    void checkSession()
    const expire = () => setSignedIn(false)
    window.addEventListener('auth-expired', expire)
    return () => window.removeEventListener('auth-expired', expire)
  }, [])
  async function signIn(email: string, password: string) {
    await apiClient.post('/auth/login', { email, password })
    setError('')
    setSignedIn(true)
  }
  async function signOut() {
    await apiClient.post('/auth/logout')
    setSignedIn(false)
  }
  return <AuthContext.Provider value={{ signedIn, checking, error, signIn, signOut, checkSession }}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used within AuthProvider')
  return auth
}
