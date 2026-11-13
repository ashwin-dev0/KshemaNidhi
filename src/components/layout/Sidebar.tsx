import { Banknote, LayoutDashboard, LogOut, Users, WalletCards } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/loans', label: 'Loans', icon: Banknote },
  { to: '/contributions', label: 'Contributions', icon: WalletCards },
  { to: '/members', label: 'Members', icon: Users },
]

export function Sidebar({ onSignOut, signingOut, disabled }: { onSignOut: () => void; signingOut: boolean; disabled: boolean }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
        <img src="/kn-icon.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-xl" />
        <div><div className="font-extrabold tracking-tight text-slate-950">KshemaNidhi</div><div className="text-xs text-slate-500">Family fund manager</div></div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>
            <Icon size={18}/>{label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4"><Button variant="ghost" className="w-full justify-start" disabled={disabled} onClick={onSignOut}><LogOut size={18} />{signingOut ? 'Signing out...' : 'Logout'}</Button></div>
    </aside>
  )
}
