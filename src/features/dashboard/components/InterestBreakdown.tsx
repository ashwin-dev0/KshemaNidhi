import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { money } from '../../../utils/currency'
import { expectedInterestForLoan, interestReceivedForLoan } from '../../loans/calculations'
import type { Loan } from '../../loans/types/loan.types'

export function InterestBreakdown({ loans }: { loans: Loan[] }) {
  const [open, setOpen] = useState(false)
  return <Card className="overflow-hidden">
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div><h2 className="font-bold text-slate-950">Interest breakdown</h2><p className="mt-1 text-sm text-slate-500">Expected, received and pending interest by borrower.</p></div>
      <Button variant="secondary" onClick={() => setOpen((v) => !v)}>{open ? <ChevronUp size={17}/> : <ChevronDown size={17}/>} {open ? 'Hide' : 'View breakdown'}</Button>
    </div>
    {open && <div className="border-t border-slate-100">
      <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3">Borrower</th><th className="px-6 py-3">Principal</th><th className="px-6 py-3">Expected</th><th className="px-6 py-3">Received</th><th className="px-6 py-3">Pending</th></tr></thead><tbody className="divide-y divide-slate-100">{loans.map((loan) => { const expected=expectedInterestForLoan(loan); const received=interestReceivedForLoan(loan); return <tr key={loan.id}><td className="px-6 py-4 font-semibold">{loan.name}</td><td className="px-6 py-4">{money(loan.principal)}</td><td className="px-6 py-4">{money(expected)}</td><td className="px-6 py-4 text-emerald-700">{money(received)}</td><td className="px-6 py-4 text-amber-700">{money(Math.max(0,expected-received))}</td></tr>})}</tbody></table></div>
      <div className="divide-y divide-slate-100 md:hidden">{loans.map((loan) => { const expected=expectedInterestForLoan(loan); const received=interestReceivedForLoan(loan); return <div key={loan.id} className="p-5"><div className="font-bold">{loan.name}</div><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><span className="block text-xs text-slate-500">Expected</span>{money(expected)}</div><div><span className="block text-xs text-slate-500">Received</span>{money(received)}</div><div><span className="block text-xs text-slate-500">Pending</span>{money(Math.max(0,expected-received))}</div><div><span className="block text-xs text-slate-500">Principal</span>{money(loan.principal)}</div></div></div>})}</div>
    </div>}
  </Card>
}
