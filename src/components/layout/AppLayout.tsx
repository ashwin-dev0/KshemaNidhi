import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { useAuth } from '../../features/auth/AuthProvider'
import { Button } from '../ui/Button'
import { useFundStore } from '../../store/fundStore'

export function AppLayout() {
  const { signOut } = useAuth()
  const { loaded, busy, error, reload } = useFundStore()
  const [signOutError, setSignOutError] = useState('')
  const [leaving, setLeaving] = useState(false)
  async function handleSignOut() {
    setLeaving(true)
    setSignOutError('')
    try { await signOut() }
    catch (error) { setSignOutError(error instanceof Error ? error.message : 'Unable to sign out.') }
    finally { setLeaving(false) }
  }
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <div className="mx-auto flex min-h-screen w-full max-w-[1800px]">
      <Sidebar onSignOut={handleSignOut} signingOut={leaving} disabled={busy || leaving} />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pt-7 md:px-8 lg:px-10 lg:pb-10 xl:px-12 2xl:px-16">
        <div className="mx-auto w-full max-w-[1500px]">{(error || signOutError) && <div role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error || signOutError}{!loaded && <Button variant="ghost" onClick={reload}>Retry</Button>}</div>}{!loaded ? <p role="status" className="py-10 text-center text-slate-500">{error ? 'Unable to load fund data.' : 'Loading fund data...'}</p> : <fieldset disabled={busy || leaving} className="m-0 min-w-0 border-0 p-0"><legend className="sr-only">Fund management</legend>{busy && <p role="status" className="mb-3 text-sm text-emerald-700">Saving changes...</p>}<Outlet /></fieldset>}</div>
      </main>
    </div>
    <MobileNav onSignOut={handleSignOut} signingOut={leaving} disabled={busy || leaving} />
  </div>
}
