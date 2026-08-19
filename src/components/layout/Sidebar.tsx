import { Banknote, LayoutDashboard, Users, WalletCards } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/loans', label: 'Loans', icon: Banknote },
  { to: '/contributions', label: 'Contributions', icon: WalletCards },
  { to: '/members', label: 'Members', icon: Users },
]

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-white"><WalletCards size={20}/></div>
        <div><div className="font-extrabold tracking-tight text-slate-950">KshemaNidhi</div><div className="text-xs text-slate-500">Family fund manager</div></div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>
            <Icon size={18}/>{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-5 text-xs leading-5 text-slate-400">Frontend-only prototype. Data stays in this browser.</div>
    </aside>
  )
}
