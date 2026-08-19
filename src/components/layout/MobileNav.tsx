import { Banknote, LayoutDashboard, Users, WalletCards } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/loans', label: 'Loans', icon: Banknote },
  { to: '/contributions', label: 'Contrib.', icon: WalletCards },
  { to: '/members', label: 'Members', icon: Users },
]

export function MobileNav() {
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
    {nav.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}><Icon size={19}/><span className="truncate">{label}</span></NavLink>)}
  </nav>
}
