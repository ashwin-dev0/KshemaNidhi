import { useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useAuth } from '../AuthProvider'

export function LoginPage() {
  const { signedIn, checking, error: connectionError, signIn, checkSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from
  const destination = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && from.split(/[?#]/)[0] !== '/login' ? from : '/'
  if (checking) return <main className="grid min-h-svh place-items-center bg-slate-50"><p role="status" className="text-sm text-slate-500">Checking your session...</p></main>
  if (signedIn) return <Navigate to={destination} replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmitting(true)
    setError('')
    try {
      await signIn(String(data.get('email')), String(data.get('password')))
      navigate(destination, { replace: true })
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to sign in.') }
    finally { setSubmitting(false) }
  }

  return <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-slate-50 px-5 py-8 sm:px-6 sm:py-12">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-emerald-100/80 to-transparent" />
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-3">
        <img src="/kn-icon.svg" alt="" width={64} height={64} className="h-16 w-16 rounded-2xl shadow-lg shadow-emerald-950/15" />
        <p className="text-xl font-extrabold tracking-tight text-slate-950">KshemaNidhi</p>
      </div>
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8" aria-labelledby="login-title">
        <div className="mb-7"><h1 id="login-title" className="text-2xl font-bold tracking-tight text-slate-950">Welcome back</h1><p className="mt-1.5 text-sm text-slate-500">Sign in to continue.</p></div>
        {(error || connectionError) && <div role="alert" className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">{error || connectionError}{connectionError && <button type="button" className="ml-2 font-semibold underline underline-offset-2" onClick={() => void checkSession()}>Retry</button>}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label><Input id="email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} inputMode="email" placeholder="you@example.com" required className="min-h-12 text-base!" /></div>
          <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><div className="relative"><Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" minLength={8} required className="min-h-12 pr-12 text-base!" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-xl text-slate-400 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></div>
          <Button type="submit" disabled={submitting} className="min-h-12 w-full">{submitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={18} /></Button>
        </form>
      </section>
    </div>
  </main>
}
