import type { ReactNode } from 'react'
import { Card } from '../../../components/ui/Card'
export function StatCard({ icon, label, value, note, emphasis = false }: { icon: ReactNode; label: string; value: string; note?: string; emphasis?: boolean }) {
  return <Card className={`p-4 sm:p-5 ${emphasis ? 'border-emerald-200 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white' : ''}`}>
    <div className="flex items-start justify-between gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl ${emphasis ? 'bg-white/15' : 'bg-slate-100 text-slate-700'}`}>{icon}</div></div>
    <div className="mt-5"><div className={`text-xs font-semibold uppercase tracking-wide ${emphasis ? 'text-emerald-50' : 'text-slate-500'}`}>{label}</div><div className="mt-1 break-words text-xl font-extrabold tracking-tight sm:text-2xl">{value}</div>{note && <div className={`mt-1 text-xs ${emphasis ? 'text-emerald-100' : 'text-slate-400'}`}>{note}</div>}</div>
  </Card>
}
